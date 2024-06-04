import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import cors from "cors";
import fetchingCron from "./cron.js";
import mongoose from "mongoose";
import comManager from "./communicationManager.js";
import downloadsManager from "./downloadsManager.cjs";
import {
  Song,
  VotingRecord,
  ReportSong,
  SelectedSong,
  ReportUser,
  BellsGroupsTemplate,
  ThemeModals,
} from "./models.js";
import axios from "axios";
import minimist from "minimist";
import dotenv from "dotenv";
import NodeCache from "node-cache";

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

const provisionalSelectedSongs = {};

// API routes
app.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get voting records per user id
app.get("/votingRecords/:userId", async (req, res) => {
  try {
    const votingRecord = await VotingRecord.findOne({
      userId: req.params.userId,
    });
    res.json(votingRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get reports per user id
app.get("/reportSongs/:userId", async (req, res) => {
  try {
    const reports = await ReportSong.find({ userId: req.params.userId });
    res.json(reports);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/sortedVotedSongs", async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        // Convert the votesPerGroup map to an array of key-value pairs
        $addFields: {
          votesPerGroupArray: { $objectToArray: "$votesPerGroup" },
        },
      },
      { $unwind: "$votesPerGroupArray" },
      {
        // Sort by group ID first (if needed to ensure group order) and then by votes descending
        $sort: {
          "votesPerGroupArray.k": 1,
          "votesPerGroupArray.v": -1,
        },
      },
      {
        // Group by group ID and push the songs into an array
        $group: {
          _id: "$votesPerGroupArray.k",
          songs: {
            $push: {
              id: "$id",
              name: "$name",
              artists: "$artists",
              img: "$img",
              explicit: "$explicit",
              preview_url: "$preview_url",
              votes: "$votesPerGroupArray.v",
              submittedBy: "$submittedBy",
            },
          },
        },
      },
      // Sort by group ID
      { $sort: { _id: 1 } },
      {
        // Project the final result
        $project: {
          _id: 0,
          group: "$_id",
          songs: "$songs",
        },
      },
    ]);
    res.json(songs);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/reportSongs/:songId", async (req, res) => {
  try {
    const reports = await ReportSong.find({ songId: req.params.songId });
    res.json(reports);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/adminSongs/:userToken", async (req, res) => {
  try {
    // Query all proposed songs
    const songs = await Song.find();

    // Iterate through each song
    const songsWithReports = await Promise.all(
      songs.map(async (song) => {
        // Find the reports associted to the song
        const reports = await ReportSong.find({ songId: song.id });

        // Find the user that proposed the song
        const user = await comManager.showUser(
          req.params.userToken,
          song.submittedBy
        );

        // Transform the mongoose.Document into an object
        song = song.toObject();

        // Add reports and user associated to the song
        song.reports = reports;
        song.user = user;

        return song;
      })
    );

    res.json(songsWithReports);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/users/:userToken", async (req, res) => {
  try {
    let users;

    if (myCache.get("users")) {
      users = myCache.get("users");
    } else {
      users = await comManager.getUsers(req.params.userToken);
      myCache.set("users", users, DEFAULT_CACHE_TTL);
    }

    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/publicGroups", async (req, res) => {
  try {
    let groups;

    if (myCache.get("groups")) {
      groups = myCache.get("groups");
    } else {
      groups = await comManager.getPublicGroups();
      myCache.set("groups", groups, DEFAULT_CACHE_TTL);
    }

    res.json(groups);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/publicCategories", async (req, res) => {
  try {
    let categories;

    if (myCache.get("categories")) {
      categories = myCache.get("categories");
    } else {
      categories = await comManager.getPublicCategories();
      myCache.set("categories", categories, DEFAULT_CACHE_TTL);
    }

    res.json(categories);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/allGroupsAndCategories", async (req, res) => {
  try {
    let groupsAndCategories;

    if (myCache.get("allGroupsAndCategories")) {
      groupsAndCategories = myCache.get("allGroupsAndCategories");
    } else {
      groupsAndCategories = await comManager.getAllGroupsAndCategories();
      myCache.set(
        "allGroupsAndCategories",
        groupsAndCategories,
        DEFAULT_CACHE_TTL
      );
    }

    res.json(groupsAndCategories);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/addGroupsToUser", async (req, res) => {
  try {
    myCache.del("users");
    const response = await comManager.setUserGroups(
      req.body.userId,
      req.body.token,
      req.body.groups
    );
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/bells/:userToken", async (req, res) => {
  try {
    let bells;

    if (myCache.get("bells")) {
      bells = myCache.get("bells");
    } else {
      bells = await comManager.getBells(req.params.userToken);
      // console.log("bells", bells);
      myCache.set("bells", bells, DEFAULT_CACHE_TTL);
    }

    res.json(bells);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/logout", async (req, res) => {
  try {
    let response = await comManager.logout(req.body.token);
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/userInfo", async (req, res) => {
  try {
    let response = await comManager.getUserInfo(req.body.token);
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/createGroupCategory", async (req, res) => {
  try {
    myCache.flushAll();

    let response = await comManager.createGroupCategory(
      req.body.token,
      req.body.category
    );
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/createGroup", async (req, res) => {
  try {
    myCache.flushAll();

    let response = await comManager.createGroup(req.body.token, req.body.group);
    res.json(response);
  } catch (err) {
    res.status(500).send;
  }
});

app.post("/storeSelectedSongs", async (req, res) => {
  try {
    // Check that the user is authenticated with Laravel Sanctum and is not a student
    let user = await comManager.getUserInfo(req.body.token);
    if (!user.id || user.role_id >= 4) return;

    // Remove all selected songs from the database
    await SelectedSong.deleteMany({});

    // Save the selected songs to mongo db
    const songs = req.body.songs;

    songs.forEach(async (song) => {
      await new SelectedSong({
        id: song.id,
        bellId: song.bellId,
        name: song.name,
        artists: song.artists,
        img: song.img,
        preview_url: song.preview_url,
        selectedDate: new Date(),
        userId: song.userId,
      }).save();
    });

    res.json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/selectedSongs", async (req, res) => {
  try {
    const selectedSongs = await SelectedSong.find({});
    await downloadsManager.downloadSongs(selectedSongs);

    const handleRequest = downloadsManager.getDownloadedSongs();
    handleRequest(req, res); // Pass the req, res to the handler function
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/getSelectedSongs", async (req, res) => {
  try {
    const selectedSongs = await SelectedSong.find({});
    res.json(selectedSongs);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/roles/:userToken", async (req, res) => {
  try {
    let roles = await comManager.getRoles(req.params.userToken);
    res.json(roles);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/userGroups/:userToken", async (req, res) => {
  try {
    let userGroups = await comManager.getUserGroups(req.params.userToken);

    // Iterate through each group
    const userGroupsWithReports = await Promise.all(
      userGroups.map(async (group) => {
        // Find the reports associted to the group
        const reports = await ReportUser.find({ groupId: group.id });

        // Add reports associated to the group
        group.reports = reports;
        return group;
      })
    );

    res.json(userGroupsWithReports);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/usersVotes", async (req, res) => {
  try {
    const song = await Song.findOne({ id: req.body.songId });
    if (song) {
      // Find all users that voted for the song with the given id
      // el $in es para buscar en un array de valores (en este caso, en el array de votedSongs) si el valor song.id está presente
      let usersVotesMongo = await VotingRecord.find({
        votedSongs: { $in: [song.id] },
      });

      //get token from the request
      let token = req.body.token;

      //get the users votes
      let usersVotes = await comManager.getUsersVotes(usersVotesMongo, token);

      res.json(usersVotes);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// GROUP BELLS TEMPLATE
app.post("/bellsGroupsTemplate", async (req, res) => {
  try {
    const template = new BellsGroupsTemplate(req.body.template);
    await template.save();
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const userToken = req.headers["authorization"].split(" ")[1];
    let user = await comManager.showUser(userToken, req.params.userId);
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/bellsGroupsTemplate", async (req, res) => {
  try {
    const templates = await BellsGroupsTemplate.find();
    res.json(templates);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/bellsGroupsTemplate/:id", async (req, res) => {
  try {
    await BellsGroupsTemplate.findByIdAndDelete(req.params.id);
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/checkThemeModal/:theme/:userId", async (req, res) => {
  const theme = req.params.theme;
  const userId = parseInt(req.params.userId);

  try {
    const themeModal = await ThemeModals.findOne({ userId: userId });
    if (!themeModal) {
      return res.json({ status: "success", showModal: true });
    } else {
      let modalShowed = themeModal.modalsShown.get(theme);
      if (!modalShowed) {
        return res.json({ status: "success", showModal: true });
      } else {
        return res.json({ status: "success", showModal: false });
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/acceptThemeTerms", async (req, res) => {
  const theme = req.body.theme;
  const userId = req.body.userId;

  try {
    const themeModal = await ThemeModals.findOne({ userId: userId });
    if (!themeModal) {
      const newThemeModal = new ThemeModals({
        userId: userId,
        modalsShown: new Map([[theme, true]]),
      });
      await newThemeModal.save();
    } else {
      themeModal.modalsShown.set(theme, true);
      await themeModal.save();
    }
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
});

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
};
let spotifyToken = "";

// Función para obtener y actualizar el token de Spotify
async function obtenerActualizarTokenSpotify() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "client_credentials",
        client_id: spotifyClientId,
        client_secret: spotifyClientSecret,
      },
      { headers }
    );
    if (response.data.access_token) {
      spotifyToken = response.data.access_token;
    } else {
      console.error("No se pudo obtener el token de Spotify.");
    }
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
        // console.log("UserData:", userData);
        let groups = [];
        console.log(userData);
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
