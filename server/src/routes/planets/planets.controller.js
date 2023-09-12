const { planets } = require("../../models/planets.mode");
function getAllPlanets(req, res) {
  return res.status(200).json(planets);
}
module.exports = { getAllPlanets };
