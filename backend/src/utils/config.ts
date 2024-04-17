import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "./logger";
dotenv.config();
const MONGO_URI =
  "mongodb+srv://admin:14E387ppFFOfl5wI@skillsbridgecluster.4wh4jdq.mongodb.net/SkillsBridgeDB?retryWrites=true"; //process.env.MONGO_URI!;
const PORT = process.env.PORT || 8000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000'

export function connectToDatabase() {
  mongoose
    .connect(MONGO_URI)
    .then(() => logger.info("Successfully connected to database"))
    .catch((error) => logger.error("Unable to connect to mongo", error));
}

export default {
  connectToDatabase,
  PORT,
  FRONTEND_ORIGIN
};
