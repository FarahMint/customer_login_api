const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const rjwt = require("restify-jwt-community");

//init restify
const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// want all route protected except for auth
// server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ["/auth"] }));

server.listen(config.PORT, () => {
  mongoose.connect(
    config.MONGO_URI,
    { useNewUrlParser: true }
  );
});

// initialise DB var
const db = mongoose.connection;

// HANDLE DB ERR
db.on("error", err => console.log(err));

// handle opening of the DB
db.once("open", () => {
  //  create route
  require("./routes/customers")(server);
  require("./routes/users")(server);
  console.log(`Server started on ports ${config.PORT}`);
});
