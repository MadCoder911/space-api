const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");
const DEFAULT_FLIGHT_NUMBER = 101;
const launches = new Map();
const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler exploration X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", //not applicable
  customer: ["ZTM", "NASA"], //payload.customers
  upcoming: true, //upcoming
  success: true, //success
};
launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function loadLaunchesData() {
  const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
  console.log("Downloading data");
  const res = await axios.post(`${SPACEX_API_URL}`, {
    query: {},
    options: {
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  const launchDocs = res.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(launch.flightNumber, launch.rocket);
  }
}

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne({}).sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}
async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}
async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    kepler_name: launch.target,
  });
  if (!planet) {
    throw new Error("No matchingg planet found");
  }
  const newFlightNum = (await getLatestFlightNumber()) + 1;
  console.log(newFlightNum);
  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNum,
  };

  await saveLaunch(newLaunch);
  return newLaunch;
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}
module.exports = {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
  loadLaunchesData,
};
