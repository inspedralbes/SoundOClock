import dotenv from "dotenv";
import mongoose from "mongoose";
import minimist from "minimist";

import {
  Song,
  VotingRecord,
  ReportSong,
  SelectedSong,
  ReportUser,
  BellsGroupsTemplate,
  ThemeModals,
} from "./models.js";

dotenv.config();

const argv = minimist(process.argv.slice(2));
const host = argv.host || "mongodb";
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

mongoose
  .connect(
    `mongodb://${mongoUser}:${mongoPassword}@${host}:27017/soundoclock`,
    { authSource: "admin" }
  )
  .then(() => console.log("MongoDB connected in MongoDB.manager.js"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function vaciarSong() {
  await Song.deleteMany({});
  console.log("Song collection deleted");
}

async function vaciarReportSong() {
  await ReportSong.deleteMany({});
  console.log("ReportSong collection deleted");
}

async function vaciarSelectedSong() {
  await SelectedSong.deleteMany({});
  console.log("SelectedSong collection deleted");
}

async function vaciarReportUser() {
  await ReportUser.deleteMany({});
  console.log("ReportUser collection deleted");
}

async function vaciarThemeModals() {
  await ThemeModals.deleteMany({});
  console.log("ThemeModals collection deleted");
}

async function vaciarVotingRecord() {
  await VotingRecord.deleteMany({});
  console.log("VotingRecord collection deleted");
}

async function vaciarBellsGroupsTemplate() {
  await BellsGroupsTemplate.deleteMany({});
  console.log("BellsGroupsTemplate collection deleted");
}

async function vaciarAllCollections() {
  await vaciarSong();
  await vaciarReportSong();
  await vaciarSelectedSong();
  await vaciarReportUser();
  await vaciarThemeModals();
  await vaciarVotingRecord();
  await vaciarBellsGroupsTemplate();
}

const mongoDBManager = {
  vaciarSong,
  vaciarReportSong,
  vaciarSelectedSong,
  vaciarReportUser,
  vaciarThemeModals,
  vaciarVotingRecord,
  vaciarBellsGroupsTemplate,
  vaciarAllCollections,
};

export default mongoDBManager;
