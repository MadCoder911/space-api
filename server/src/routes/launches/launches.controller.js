const {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");
//
//Getting launches for the databse
async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);

  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}
//
//Adding a new launch
async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing required launch property" });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid Date" });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}
//
//Aborting a launch
async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  const launch = await existsLaunchWithId(launchId);
  if (!launch) {
    return res.status(404).json({ error: "Launch not found" });
  }
  const aborted = await abortLaunchById(launchId);
  return res.status(200).json(aborted);
}
module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
