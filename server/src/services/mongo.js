const mongoose = require("mongoose");
const MONGO_URL =
  "mongodb+srv://nasa-api:OKQAqBPPUc6aYKsb@nasa.08qb1tn.mongodb.net/nasa?retryWrites=true&w=majority";
mongoose.connection.once("open", () => {
  console.log("Connection Ready");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

module.expors = { mongoConnect };
