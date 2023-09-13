//Initializations
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.mode");
//Port
const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://nasa-api:OKQAqBPPUc6aYKsb@nasa.08qb1tn.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

//Starting server
mongoose.connection.once("open", () => {
  console.log("Connection Ready");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});
async function startServer() {
  await mongoose.connect(MONGO_URL);

  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
startServer();
