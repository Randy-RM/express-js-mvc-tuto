import mongoose from "mongoose";

const dbString = process.env.MONGOHQ_URL || "";
const dbConnection = mongoose.createConnection(dbString);

export default dbConnection;
