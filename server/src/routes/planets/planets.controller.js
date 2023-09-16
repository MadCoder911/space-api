const { getAllPlanets } = require("../../models/planets.mode");
//Get all planets from the database
async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
}
module.exports = { httpGetAllPlanets };
