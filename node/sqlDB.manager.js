import dotenv from "dotenv";
import mysql from "mysql2";

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
    console.error("Error al conectar con la base de datos MySQL:", err);
    throw err;
  }
  console.log("Conectado a la base de datos MySQL");
});

// Función para vaciar la tabla bans
function vaciarBans() {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM bans";
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error al vaciar tabla bans:", err);
        return reject(err);
      }
      console.log(
        `Se han eliminado ${result.affectedRows} registros de la tabla bans`
      );
      resolve(result);
    });
  });
}

// Función para vaciar la tabla blacklist
function vaciarBlacklist() {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM blacklist";
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error al vaciar tabla blacklist:", err);
        return reject(err);
      }
      console.log(
        `Se han eliminado ${result.affectedRows} registros de la tabla blacklist`
      );
      resolve(result);
    });
  });
}

// Función para vaciar la tabla group_user
function vaciarGroupUser() {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM group_user";
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error al vaciar tabla group_user:", err);
        return reject(err);
      }
      console.log(
        `Se han eliminado ${result.affectedRows} registros de la tabla group_user`
      );
      resolve(result);
    });
  });
}

// Función para vaciar la tabla users
function vaciarUsers() {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM users";
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error al vaciar tabla users:", err);
        return reject(err);
      }
      console.log(
        `Se han eliminado ${result.affectedRows} registros de la tabla users`
      );
      resolve(result);
    });
  });
}

// Función para vaciar todas las tablas
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
