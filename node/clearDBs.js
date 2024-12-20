import dotenv, { config } from "dotenv";
import sqlDB_Manager from "./sqlDB.manager";
import mongoDBManager from "./mongoDB.manager";

dotenv.config();

async function clearDBs() {
  await mongoDBManager.vaciarAllCollections();
  await sqlDB_Manager.vaciarTablas();
}

if (process.env.NODE_ENV === "preprod") {
  clearDBs();
}
