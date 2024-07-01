import dotenv, { config } from "dotenv";
import mongoDBManager from "./mongoDB.manager.js";
import sqlDB_Manager from "./sqlDB.manager.js";

dotenv.config();

async function clearDBs() {
  await mongoDBManager.vaciarAllCollections();
  await sqlDB_Manager.vaciarTablas();
}

if (process.env.NODE_ENV === "preprod") {
  clearDBs();
}
