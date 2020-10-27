const mongoose = require("mongoose");

// connect to db (mongodb + mongoose)
let connectionString = process.env.DB_URL_TEST;
// let connectionString = process.env.DB_URL_PROD; // leave only when testing production db
if (process.env.MODE !== "test") connectionString = process.env.DB_URL_PROD;

mongoose.connect(connectionString, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

module.exports = db;
