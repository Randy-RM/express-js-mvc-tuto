const mongoose = require("mongoose");

const dbString = process.env.MONGOHQ_URL;
const dbOptions = {};
let dbConnection = {};
try {
  dbConnection = mongoose.createConnection(dbString, dbOptions);
} catch (error) {
  dbConnection = null;
}
// Expose the connection
module.exports = dbConnection;
