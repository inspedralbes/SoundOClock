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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const myCache = new NodeCache();
const DEFAULT_CACHE_TTL = 7200; // 2 hours

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  path: "/socket",
});

const port = 8080;
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
    console.error("Error al obtener el token de Spotify:", error);
  }
}

// Obtener y actualizar el token de Spotify cada 59 minutos
setInterval(obtenerActualizarTokenSpotify, 59 * 60 * 1000);

// Obtener y actualizar el token de Spotify al iniciar el servidor
obtenerActualizarTokenSpotify();

let dirPC = null;
let amountUsers = 0;

if (process.env.NODE_ENV === "preprod") {
  fetchingCron.clearDBs();
}

fetchingCron.mailReminder();

// Sockets

io.on("connection", (socket) => {
  amountUsers++;
  fetchingCron.task(socket);
  console.log("A user connected. Total users:", amountUsers);

  socket.on("googleLogin", (userToken) => {
    comManager
      .googleLogin(userToken)
      .then((userData) => {
        let groups = [];
        // Populate groups array with group_id
        userData.user.groups.forEach((group) => {
          groups.push(group.pivot.group_id);
        });

        socket.emit(
          "loginData",
          userData.user.id,
          userData.user.email,
          userData.user.name,
          userData.user.picture,
          userData.token,
          groups,
          userData.user.role_id,
          userData.user.role_name
        );
      })
      .catch((err) => {
        console.error(err);
      });
  });

  socket.on("publicLogin", () => {
    socket.emit("publicLogin");
    comManager.tempLogin().then((userData) => {
      let groups = [];
      // Populate groups array with group_id
      userData.user.groups.forEach((group) => {
        groups.push(group.pivot.group_id);
      });

      socket.emit(
        "loginData",
        userData.user.id,
        userData.user.email,
        userData.user.name,
        userData.user.picture,
        userData.token,
        groups,
        userData.user.role_id,
        userData.user.role_name
      );
    });
  });

  socket.on("login", async (email, name) => {
    try {
      let user = await comManager.login(name, email);
      socket.emit(
        "loginData",
        user.user.id,
        user.user.email,
        user.user.name,
        user.user.picture,
        user.token,
        user.user.groups,
        user.user.role_id,
        user.user.role_name
      );
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("updateProvisionalSelectedSongs", (bellId, songId) => {
    if (bellId && songId) {
      // If the song is already selected, unselect it
      if (provisionalSelectedSongs[bellId] === songId) {
        provisionalSelectedSongs[bellId] = null;
      } else {
        provisionalSelectedSongs[bellId] = songId;
      }
    }

    io.emit("provisionalSelectedSongsUpdated", provisionalSelectedSongs);
  });

  // Post song checking for duplicates first
  socket.on("postSong", async (userToken, songData) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    // TODO: songData does not include the year of the song, it should

    try {
      // Check if the user can post a song
      if (
        user.propose_banned_until > new Date().toISOString().substring(0, 10)
      ) {
        console.log("postError Estàs bloquejat");
        socket.emit("postError", {
          status: "error",
          title: `Estàs bloquejat`,
          message: `No pots proposar cançons fins el ${formatDate(
            user.propose_banned_until
          )}.`,
        });
        return;
      }

      // Check if the song is in the blacklist
      const blacklistSongs = await comManager.getBlackList(userToken);

      for (let i = 0; i < blacklistSongs.length; i++) {
        if (blacklistSongs[i].spotify_id == songData.id) {
          console.log("postError Cançó no disponibl");
          socket.emit("postError", {
            status: "error",
            title: `Cançó no disponible`,
            message: `La cançó ${blacklistSongs[i].name} no està disponible.`,
          });
          return;
        }
      }

      // Check if the song already exists
      const existingSong = await Song.findOne({ id: songData.id });
      if (existingSong) {
        console.log("postError Cançó ja proposada");
        socket.emit("postError", {
          status: "error",
          title: `Cançó ja proposada`,
          message: `La cançó ${existingSong.name} ja ha sigut proposada per un altre usuari.`,
        });
        return;
      }

      // Check if the user already submitted a song
      const votingRecord = await VotingRecord.findOne({ userId: user.id });
      if (votingRecord && votingRecord.submitted && user.role_id >= 4) {
        console.log("postError Ja has proposat una cançó");
        socket.emit("postError", {
          status: "error",
          title: `Ja has proposat una cançó`,
          message:
            "Ja has proposat una cançó, espera a la següent votació per proposar una altra.",
        });
        return;
      }

      // Save the song and update the voting record
      const newSong = new Song(songData);
      await newSong.save();

      console.log("song posted");

      if (!votingRecord) {
        let userGroups = user.groups.map((group) => group.id);
        let votingRecord = new VotingRecord({
          userId: user.id,
          submitted: true,
          votedSongs: [],
          groups: userGroups,
        });

        // Process to ADD a vote to the newSong
        // Check if the user can vote a song
        if (
          user.vote_banned_until < new Date().toISOString().substring(0, 10) ||
          user.vote_banned_until == null ||
          user.role_id >= 4
        ) {
          // Añadir un voto a la canción
          newSong.totalVotes += 1;
          // Actualizar el recuento de votos por grupo de la newSong
          user.groups.forEach((group) => {
            let votes = newSong.votesPerGroup.get(group.id.toString());
            if (votes > 0) {
              newSong.votesPerGroup.set(group.id.toString(), votes + 1);
            } else {
              newSong.votesPerGroup.set(group.id.toString(), 1);
            }
          });

          // Añadir la canción a la lista de canciones votadas del usuario
          votingRecord.votedSongs.push(songData.id);

          // Guardar la canción y actualizar el registro de votación
          await newSong.save();
        }
        await votingRecord.save();
        // await new VotingRecord({ userId: user.id, submitted: false, votedSongs: [], groups: userGroups }).save();
      } else {
        votingRecord.submitted = true;

        // Process to ADD a vote to the newSong
        // Check if the user can vote a song
        if (
          user.vote_banned_until < new Date().toISOString().substring(0, 10) ||
          user.vote_banned_until == null ||
          user.role_id >= 4
        ) {
          // Check if the user already voted twice
          if (votingRecord.votedSongs.length > 1 && user.role_id >= 4) {
            socket.emit("voteError", {
              status: "error",
              title: `Has arribat al límit`,
              message: `Atenció! En aquesta votació, cada persona disposa d'un màxim de dos vots. Aquesta mesura s'implementa per equilibrar la representació individual amb la capacitat d'influir en múltiples opcions, promovent així la diversitat d'opinions i una participació més àmplia en el procés democràtic. Gràcies per la teva participació!`,
            });
          } else {
            // Añadir un voto a la canción
            newSong.totalVotes += 1;
            // Actualizar el recuento de votos por grupo de la newSong
            user.groups.forEach((group) => {
              let votes = newSong.votesPerGroup.get(group.id.toString());
              if (votes > 0) {
                newSong.votesPerGroup.set(group.id.toString(), votes + 1);
              } else {
                newSong.votesPerGroup.set(group.id.toString(), 1);
              }
            });

            // Añadir la canción a la lista de canciones votadas del usuario
            votingRecord.votedSongs.push(songData.id);

            // Guardar la canción y actualizar el registro de votación
            await newSong.save();
          }
        }
        // votingRecord.submitted = false;
        await votingRecord.save();
      }

      io.emit("songPosted", { status: "success", song: songData });
    } catch (err) {
      console.log("postError Ja has proposat una cançó");
      socket.emit("postError", { status: "error", message: err.message });
      console.error("postError", err.message);
    }
  });

  // Cast a vote for a song
  socket.on("castVote", async (userToken, songId) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    try {
      // Check if the user can vote a song
      if (user.vote_banned_until > new Date().toISOString().substring(0, 10)) {
        socket.emit("voteError", {
          status: "error",
          title: `Estàs bloquejat`,
          message: `No pots votar cançons fins el ${formatDate(
            user.vote_banned_until
          )}.`,
        });
        return;
      }

      // Check if the song exists
      const song = await Song.findOne({ id: songId });
      if (!song) {
        socket.emit("voteError", {
          status: "error",
          message: "Song not found",
        });
        return;
      }

      // Check if the user wants to undo the vote
      const votingRecord = await VotingRecord.findOne({ userId: user.id });
      if (votingRecord && votingRecord.votedSongs.includes(songId)) {
        song.totalVotes -= 1;
        // Update the song with the new vote count per group
        user.groups.forEach((group) => {
          let votes = song.votesPerGroup.get(group.id.toString());
          if (votes > 0) {
            song.votesPerGroup.set(group.id.toString(), votes - 1);
          }
        });
        await song.save();

        votingRecord.votedSongs = votingRecord.votedSongs.filter(
          (id) => id !== songId
        );
        await votingRecord.save();

        io.emit("voteCasted", { status: "success", song });
        return;
      }

      // Check if the user already voted twice
      if (
        votingRecord &&
        votingRecord.votedSongs.length > 1 &&
        user.role_id >= 4
      ) {
        socket.emit("voteError", {
          status: "error",
          title: `Has arribat al límit`,
          message: `Atenció! En aquesta votació, cada persona disposa d'un màxim de dos vots. Aquesta mesura s'implementa per equilibrar la representació individual amb la capacitat d'influir en múltiples opcions, promovent així la diversitat d'opinions i una participació més àmplia en el procés democràtic. Gràcies per la teva participació!`,
        });
        return;
      }

      // Save the vote and update the voting record
      song.totalVotes += 1;
      // Update the song with the new vote count per group
      user.groups.forEach((group) => {
        let votes = song.votesPerGroup.get(group.id.toString());
        if (votes > 0) {
          song.votesPerGroup.set(group.id.toString(), votes + 1);
        } else {
          song.votesPerGroup.set(group.id.toString(), 1);
        }
      });
      await song.save();

      if (!votingRecord) {
        let userGroups = user.groups.map((group) => group.id);
        await new VotingRecord({
          userId: user.id,
          submitted: false,
          votedSongs: [songId],
          groups: userGroups,
        }).save();
      } else {
        votingRecord.votedSongs.push(songId);
        await votingRecord.save();
      }

      io.emit("voteCasted", { status: "success", song });
    } catch (err) {
      socket.emit("voteError", { status: "error", message: err.message });
    }
  });

  // Get all songs from the blacklist
  socket.on("getBlacklist", async (userToken) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    try {
      let songs;

      if (myCache.get("blacklist")) {
        songs = myCache.get("blacklist");
      } else {
        songs = await comManager.getBlackList(userToken);
        myCache.set("blacklist", songs, DEFAULT_CACHE_TTL);
      }

      socket.emit("sendBlacklist", songs);
    } catch (err) {
      socket.emit("getBlacklistError", {
        status: "error",
        message: err.message,
      });
    }
  });

  // remove a song from the blacklist
  socket.on("removeFromBlacklist", async (userToken, songId) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    try {
      myCache.del("blacklist");
      // Check if the song exists and delete it
      await Song.findOneAndDelete({ id: songId });

      const response = await comManager.removeSongFromBlacklist(
        userToken,
        songId
      );
      const removedSong = await response.json();

      // Notify the user that has removed the song from the blacklist
      socket.emit("notifyServerResponse", {
        status: "success",
        message: `La cançó ${removedSong.name} ha sigut eliminada de la llista negra.`,
      });

      // Update the blacklist to everybody
      io.emit("songRemovedFromBlacklist", songId);
    } catch (err) {
      socket.emit("deleteError", {
        status: "error",
        message: `No s'ha pogut eliminar la cançó de la llista negra.`,
        reason: err.message,
      });
    }
  });

  // Delete a song
  socket.on("deleteSong", async (userToken, songId, isAddedToBlacklist) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = await comManager.getUserInfo(userToken);
    if (!user.id || user.is_admin === 0) return;
    console.log("song id", songId);
    myCache.del("blacklist");
    try {
      // Check if the song exists and delete it
      const song = await Song.findOneAndDelete({ id: songId });
      if (!song) {
        socket.emit("deleteError", {
          status: "error",
          message: "Song not found",
        });
        return;
      }

      // Delete the reports associated to the song
      await ReportSong.deleteMany({ songId: songId });

      if (isAddedToBlacklist) {
        // Add song to blacklist
        const bannedSong = await comManager.addSongToBlackList(userToken, song);

        // Notify the user that banned the song
        socket.emit("notifyServerResponse", {
          status: "success",
          message: `La cançó ${bannedSong.name} ha sigut afegida a la llista negra.`,
        });
      } else {
        // Send mail to the user that proposed the song
        comManager.sendDeletedSongMail(userToken, song);

        // Notify the user that erased the song
        socket.emit("notifyServerResponse", {
          status: "success",
          message: `La cançó ${song.name} ha sigut eliminada de la llista de cançons proposades.`,
        });
      }

      // Update the proposed songs list to everybody
      io.emit("songDeleted", { status: "success", song: song });
    } catch (err) {
      socket.emit("deleteError", { status: "error", message: err.message });
    }
  });

  // Report a song
  socket.on("reportSong", async (userToken, reportedSong) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    try {
      // Check if the song exists
      const song = await Song.findOne({ id: reportedSong.songId });
      if (!song) {
        socket.emit("reportError", {
          status: "error",
          message: "Song not found",
        });
        return;
      }

      // Check if the user already reported that song
      const existingReport = await ReportSong.findOne({
        userId: user.id,
        songId: song.id,
      });
      if (existingReport) {
        socket.emit("reportError", {
          status: "error",
          message: "Ja has reportat aquesta cançó!",
        });
        return;
      }

      // Add a register in ReportSong table
      await new ReportSong({
        userId: user.id,
        userName: user.name,
        songId: song.id,
        reasons: reportedSong.options,
        isRead: false,
      }).save();

      socket.emit("songReported", {
        status: "success",
        message: `La cançó ${song.name} ha sigut reportada`,
      });
    } catch (err) {
      socket.emit("reportError", { status: "error", message: err.message });
    }
  });

  socket.on("getHtmlSpotify", (songId) => {
    comManager.fetchSpotifyPage(songId).then((html) => {
      if (html) {
        socket.emit("sendHtmlSpotify", html, songId);
      }
    });
  });

  socket.on("getTopSongs", (playlist) => {
    let limit = 1;
    let songsToEmit = [];
    comManager.getPlaylists(playlist, limit, spotifyToken).then((data) => {
      if (data) {
        data.items.forEach((song) => {
          songsToEmit.push(song.track);
        });
        socket.emit("topSongs", songsToEmit);
      }
    });
  });

  socket.on("searchId", (id) => {
    comManager.searchSongId(id, spotifyToken).then((data) => {
      if (data) {
        socket.emit("searchResultId", data);
      }
    });
  });

  socket.on("getGroups", (token) => {
    comManager
      .getGroups(token)
      .then((groups) => {
        socket.emit("sendGroups", groups);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  socket.on("deleteGroup", (token, groupId) => {
    myCache.flushAll();

    comManager
      .deleteGroup(token, groupId)
      .then((response) => {
        socket.emit("groupDeleted", response);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  socket.on("updateGroup", (token, group) => {
    myCache.flushAll();

    comManager
      .updateGroup(token, group)
      .then((response) => {
        socket.emit("groupUpdated", response);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  socket.on("getTopSongs", (playlist) => {
    let limit = 1;
    let songsToEmit = [];
    comManager.getPlaylists(playlist, limit, spotifyToken).then((data) => {
      if (data) {
        data.items.forEach((song) => {
          songsToEmit.push(song.track);
        });
        socket.emit("topSongs", songsToEmit);
      }
    });
  });

  socket.on("searchSong", (search, limit, offset) => {
    if (!search) return;
    if (!limit) limit = 30;
    if (!offset) offset = 0;

    comManager.searchSong(search, limit, spotifyToken, offset).then((data) => {
      if (data) {
        socket.emit("searchResult", data.tracks.items);
      }
    });
  });

  socket.on("loadMoreSongs", (search, limit, offset) => {
    comManager.searchSong(search, limit, spotifyToken, offset).then((data) => {
      if (data) {
        socket.emit("loadMoreSongsResult", data.tracks.items);
      }
    });
  });

  socket.on("searchId", (id) => {
    comManager.searchSongId(id, spotifyToken).then((data) => {
      if (data) {
        socket.emit("searchResultId", data);
      }
    });
  });

  socket.on("banUser", async (userToken, bannedUser) => {
    try {
      // Find the user that proposed the song
      const user = await comManager.showUser(userToken, bannedUser.id);

      myCache.del("users");

      // Update user
      const updatedUser = await comManager.updateUser(userToken, bannedUser);
      console.log("BAN USER, UPDATED USER", user, updatedUser);

      // Compare the user's changed data to customize the message
      let message = "default";

      if (user.vote_banned_until && !updatedUser.vote_banned_until) {
        message = `pot tornar a votar cançons`;
      } else if (!user.vote_banned_until && updatedUser.vote_banned_until) {
        message = `no pot votar cançons fins el ${formatDate(
          updatedUser.vote_banned_until
        )}`;
      } else if (
        user.propose_banned_until &&
        !updatedUser.propose_banned_until
      ) {
        message = `pot tornar a proposar cançons`;
      } else if (
        !user.propose_banned_until &&
        updatedUser.propose_banned_until
      ) {
        message = `no pot proposar cançons fins el ${formatDate(
          updatedUser.propose_banned_until
        )}`;
      } else {
        socket.emit("notifyServerResponse", {
          status: "error",
          message: `Un altre usuari està modificant aquest usuari. Els teus canvis potser no s'han desat.`,
        });
        return;
      }

      // Notify the user that made the modification
      socket.emit("notifyServerResponse", {
        status: "success",
        message: `L'usuari ${bannedUser.name} ${message}.`,
      });

      // Update the user banned data to everybody
      io.emit("userBanned", updatedUser);
    } catch (err) {
      socket.emit("reportError", { status: "error", message: err.message });
    }
  });

  socket.on("updateBellsGroupsRelations", async (userToken, bells) => {
    try {
      myCache.del("bells");
      let response = await comManager.setBellsGroupsConfiguration(
        userToken,
        bells
      );

      // Notify the user that made the modification
      socket.emit("notifyServerResponse", {
        status: "success",
        message: `La configuració de timbres i grups ha sigut modificada.`,
      });

      // Update the bells groups relations data to everybody
      io.emit("bellsGroupsRelationsUpdated", {
        status: "success",
        message: response,
      });
    } catch (err) {
      socket.emit("updateBellsGroupsRelationsError", {
        status: "error",
        message: err.message,
      });
    }
  });

  socket.on("dirPC", () => {
    dirPC = socket.id;
    socket.broadcast.emit("dirPCStatus", true);
  });

  socket.on("restartPcReq", () => {
    if (dirPC) {
      io.to(dirPC).emit("restartPC");
    }
  });

  socket.on("sendBells", () => {
    if (dirPC) {
      io.to(dirPC).emit("executeSendBells");
    }
  });

  socket.on("getPcStatus", () => {
    if (dirPC) {
      socket.emit("dirPCStatus", true);
    } else {
      socket.emit("dirPCStatus", false);
    }
  });

  socket.on("changeIsReadReportStatus", async (userToken, report) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    // Find the report
    const reportSong = await ReportSong.findOne({ _id: report._id });
    reportSong.isRead = report.isRead;
    await reportSong.save();
    io.emit("isReadReportStatusChanged", {
      status: "success",
      message: `El report amb id ${reportSong._id} ha canviat.`,
    });
  });

  socket.on("getPcDirLogs", (logs) => {
    console.log("logs", logs);
    socket.broadcast.emit("sendPcDirLogs", logs);
  });

  socket.on("updateUserRole", async (userToken, modifiedUser) => {
    try {
      // Update user
      comManager.updateUser(userToken, modifiedUser);

      myCache.del("users");

      // Notify the user that made the modification
      socket.emit("notifyServerResponse", {
        status: "success",
        message: `El rol de l'usuari ${modifiedUser.name} ha sigut modificat.`,
      });

      // Update the user data to everybody
      io.emit("userRoleUpdated", modifiedUser);
    } catch (err) {
      socket.emit("reportError", { status: "error", message: err.message });
    }
  });

  socket.on("setSettings", async (userToken, settings) => {
    const selectedSongs = await SelectedSong.find({});
    try {
      let response = await comManager.setSettings(
        userToken,
        settings,
        selectedSongs
      );
      settings = await comManager.getPublicSettings();
      myCache.set("settings", settings, DEFAULT_CACHE_TTL);
      io.emit("settingsUpdated", response);
    } catch (err) {
      socket.emit("setSettingsError", {
        status: "error",
        message: err.message,
      });
    }
  });

  socket.on("getSettings", async (userToken) => {
    try {
      let settings;

      if (myCache.get("settings")) {
        settings = myCache.get("settings");
      } else {
        settings = await comManager.getPublicSettings();
        myCache.set("settings", settings, DEFAULT_CACHE_TTL);
      }
      socket.emit("sendSettings", settings);
    } catch (err) {
      socket.emit("getSettingsError", {
        status: "error",
        message: err.message,
      });
    }
  });

  socket.on("deleteVotes", async (token) => {
    try {
      await ReportSong.deleteMany({});
      console.log("ReportSong collection cleared");
      await Song.deleteMany({});
      console.log("Song collection cleared");
      await VotingRecord.deleteMany({});
      console.log("VotingRecord collection cleared");
      socket.emit("votesDeleted", { status: "success" });
    } catch (err) {
      console.error(err);
    }
  });

  // Report a user does not belong to a group
  socket.on("reportUser", async (userToken, userId, groupId) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    try {
      // Check if a user in a group has already been reported
      const alreadyReported = await ReportUser.findOne({
        userId: userId,
        groupId: groupId,
      });

      // If it has not been reported yet add a register in ReportUser table
      if (!alreadyReported) {
        await new ReportUser({
          userId: userId,
          groupId: groupId,
        }).save();
      }

      // Notify the user that has made the report
      socket.emit("notifyServerResponse", {
        status: "success",
        message: `L'usuari ha sigut reportat.`,
      });
    } catch (err) {
      socket.emit("reportError", { status: "error", message: err.message });
    }
  });

  // Delete a user does not belong to a group report
  socket.on("userReportChecked", async (userToken, userId, groupId) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    try {
      // Check if the song exists and delete it
      await ReportUser.findOneAndDelete({ userId: userId, groupId: groupId });
    } catch (err) {
      socket.emit("reportError", { status: "error", message: err.message });
    }
  });

  // Delete a user from a group
  socket.on("deleteUserFromGroup", async (userToken, userId, groupId) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    myCache.del("users");

    try {
      const response = await comManager.deleteUserFromGroup(
        userToken,
        groupId,
        userId
      );
      console.log("resposta", response);

      // Notify the user that has deleted the user from the group
      socket.emit("notifyServerResponse", {
        status: "success",
        message: `L'usuari ${response.user.name} ha sigut eliminat del grup ${response.group.abbreviation}.`,
      });
    } catch (err) {
      socket.emit("notifyServerResponse", {
        status: "error",
        message: `No s'ha pogut eliminar l'usuari.`,
      });
    }
  });

  socket.on("disconnect", () => {
    amountUsers--;
    console.log("User disconnected. Total users:", amountUsers);
    if (socket.id === dirPC) {
      console.log("dirPC disconnected");
      dirPC = null;
      socket.broadcast.emit("dirPCStatus", false);
    }
  });

  socket.on("testing", (data) => {
    socket.emit("testing", data);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  io.emit("borrarLocalStorage");
});

function formatDate(date) {
  return (
    date.substring(8, 10) +
    "-" +
    date.substring(5, 7) +
    "-" +
    date.substring(0, 4)
  );
}

export { port };
