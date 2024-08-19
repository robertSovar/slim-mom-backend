import mongoose from "mongoose";
import colors from "colors";
import dontenv from "dotenv";

dontenv.config();
function connectToDb() {
  mongoose
    .connect(process.env.MONGO_DB_STRING)
    .then(() => {
      console.log("Connected to MongoDB".bgGreen);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default connectToDb;
