const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
//Connect to mongo DB using mongoose
mongoose.connection.once("open", () => {
  console.log("Connection Ready");
});
//Log any errors in the DB connection
mongoose.connection.on("error", (err) => {
  console.log(err);
});
//Connect to mongo
async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}
//Connect to mongo DB using mongoose
async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = { mongoConnect, mongoDisconnect };
