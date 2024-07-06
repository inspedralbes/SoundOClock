import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function queryDatabase(query) {
  return new Promise((resolve, reject) => {
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function vaciarBans() {
  try {
    const result = await queryDatabase("DELETE FROM bans");
    console.log(
      `Se han eliminado ${result.affectedRows} registros de la tabla bans`
    );
  } catch (err) {
    console.error("Error al vaciar tabla bans:", err);
    throw err;
  }
}

async function vaciarBlacklist() {
  try {
    const result = await queryDatabase("DELETE FROM blacklist");
    console.log(
      `Se han eliminado ${result.affectedRows} registros de la tabla blacklist`
    );
  } catch (err) {
    console.error("Error al vaciar tabla blacklist:", err);
    throw err;
  }
}

async function vaciarGroupUser() {
  try {
    const result = await queryDatabase("DELETE FROM group_user");
    console.log(
      `Se han eliminado ${result.affectedRows} registros de la tabla group_user`
    );
  } catch (err) {
    console.error("Error al vaciar tabla group_user:", err);
    throw err;
  }
}

async function vaciarUsers() {
  try {
    const result = await queryDatabase("DELETE FROM users");
    console.log(
      `Se han eliminado ${result.affectedRows} registros de la tabla users`
    );
  } catch (err) {
    console.error("Error al vaciar tabla users:", err);
    throw err;
  }
}

async function vaciarTablas() {
  try {
    await vaciarBans();
    await vaciarBlacklist();
    await vaciarGroupUser();
    await vaciarUsers();
    console.log("Todas las tablas de MySQL han sido vaciadas correctamente");
  } catch (error) {
    console.error("Error al vaciar las tablas de MySQL:", error);
    throw error;
  }
}

const sqlDB_Manager = {
  vaciarBans,
  vaciarBlacklist,
  vaciarGroupUser,
  vaciarUsers,
  vaciarTablas,
};

export default sqlDB_Manager;
