const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const planets = require("./planets.mongo");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
// New promise to ready planet names from local file and push it to mongo
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          //INSERT + UPDATE = UPSERT
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const planetsFound = (await getAllPlanets()).length;
        console.log(`${planetsFound} habitable planets found!`);
        resolve();
      });
  });
}
//Getting all planets from the DB
async function getAllPlanets() {
  const planetss = await planets.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );

  return planetss;
}
//Saving planets to the DB
async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log(`Could not save the planet ${error}`);
  }
}
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
