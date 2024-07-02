import dotenv from "dotenv";
import mysql from "mysql2";
import axios, { all } from "axios";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Conectado a la base de datos MySQL");
});

// Función para vaciar la tabla bans
async function vaciarBans() {
  const query = "DELETE FROM bans";
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(
      `Se han eliminado ${result.affectedRows} registros de la tabla bans`
    );
  });
}

// Función para vaciar la tabla blacklist
async function vaciarBlacklist() {
  const query = "DELETE FROM blacklist";
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(
      `Se han eliminado ${result.affectedRows} registros de la tabla blacklist`
    );
  });
}

// Función para vaciar la tabla group_user
async function vaciarGroupUser() {
  const query = "DELETE FROM group_user";
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(
      `Se han eliminado ${result.affectedRows} registros de la tabla group_user`
    );
  });
}

// Función para vaciar la tabla users
async function vaciarUsers() {
  const query = "DELETE FROM users";
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(
      `Se han eliminado ${result.affectedRows} registros de la tabla users`
    );
  });
}

// Función para vaciar todas las tablas
async function vaciarTablas() {
  await vaciarBans();
  await vaciarBlacklist();
  await vaciarGroupUser();
  await vaciarUsers();
}

const sqlDB_Manager = {
  vaciarBans,
  vaciarBlacklist,
  vaciarGroupUser,
  vaciarUsers,
  vaciarTablas,
};

export default sqlDB_Manager;
