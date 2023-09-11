//Initializations
const http = require("http");
const app = require("./app");
//Port
const PORT = process.env.PORT || 8000;

//Starting server

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
