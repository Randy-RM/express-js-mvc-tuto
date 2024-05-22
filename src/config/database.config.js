const mongoose = require("mongoose");

const dbString = process.env.MONGOHQ_URL;
const dbOptions = {};
const dbConnection = mongoose.createConnection(dbString, dbOptions);
// Expose the connection
module.exports = dbConnection;
