import dotenv from "dotenv";
import mongoose from "mongoose";
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
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Función para vaciar la colección Song
async function vaciarSong() {
  try {
    await Song.deleteMany({});
    console.log("Colección Song eliminada");
  } catch (error) {
    console.error("Error al eliminar colección Song:", error);
    throw error;
  }
}

// Función para vaciar la colección VotingRecord
async function vaciarVotingRecord() {
  try {
    await VotingRecord.deleteMany({});
    console.log("Colección VotingRecord eliminada");
  } catch (error) {
    console.error("Error al eliminar colección VotingRecord:", error);
    throw error;
  }
}

// Función para vaciar la colección ReportSong
async function vaciarReportSong() {
  try {
    await ReportSong.deleteMany({});
    console.log("Colección ReportSong eliminada");
  } catch (error) {
    console.error("Error al eliminar colección ReportSong:", error);
    throw error;
  }
}

// Función para vaciar la colección SelectedSong
async function vaciarSelectedSong() {
  try {
    await SelectedSong.deleteMany({});
    console.log("Colección SelectedSong eliminada");
  } catch (error) {
    console.error("Error al eliminar colección SelectedSong:", error);
    throw error;
  }
}

// Función para vaciar la colección ReportUser
async function vaciarReportUser() {
  try {
    await ReportUser.deleteMany({});
    console.log("Colección ReportUser eliminada");
  } catch (error) {
    console.error("Error al eliminar colección ReportUser:", error);
    throw error;
  }
}

// Función para vaciar la colección BellsGroupsTemplate
async function vaciarBellsGroupsTemplate() {
  try {
    await BellsGroupsTemplate.deleteMany({});
    console.log("Colección BellsGroupsTemplate eliminada");
  } catch (error) {
    console.error("Error al eliminar colección BellsGroupsTemplate:", error);
    throw error;
  }
}

// Función para vaciar la colección ThemeModals
async function vaciarThemeModals() {
  try {
    await ThemeModals.deleteMany({});
    console.log("Colección ThemeModals eliminada");
  } catch (error) {
    console.error("Error al eliminar colección ThemeModals:", error);
    throw error;
  }
}

// Función para vaciar todas las colecciones
async function vaciarAllCollections() {
  try {
    await vaciarSong();
    await vaciarVotingRecord();
    await vaciarReportSong();
    await vaciarSelectedSong();
    await vaciarReportUser();
    await vaciarBellsGroupsTemplate();
    await vaciarThemeModals();
    console.log(
      "Todas las colecciones de MongoDB han sido vaciadas correctamente"
    );
  } catch (error) {
    console.error("Error al vaciar las colecciones de MongoDB:", error);
    throw error;
  }
}

const mongoDBManager = {
  vaciarSong,
  vaciarVotingRecord,
  vaciarReportSong,
  vaciarSelectedSong,
  vaciarReportUser,
  vaciarBellsGroupsTemplate,
  vaciarThemeModals,
  vaciarAllCollections,
};

export default mongoDBManager;
