import express from 'express';
import { createServer, get } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import comManager from './communicationManager.js';
import { Song, VotingRecord, ReportSong } from './models.js';
import axios from 'axios';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const host = argv.host || 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  }
});
const port = process.env.PORT || 8080;

// Mongoose setup
mongoose.connect('mongodb://mongoadmin:mongopassword@' + host + ':27017/soundoclock', { authSource: "admin" })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function insertDefaultsMongo() {
  const songs = [
    { id: '0VjIjW4GlUZAMYd2vXMi3b', title: 'Blinding Lights', artist: 'The Weeknd', year: 2020, img: 'https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36', previewUrl: 'https://example.com/blinding-lights-preview', submitDate: new Date('2020-11-29'), submittedBy: 1 },
    { id: '62PaSfnXSMyLshYJrlTuL3', title: 'Hello', artist: 'Adele', year: 2015, img: 'https://i.scdn.co/image/ab67616d00001e0247ce408fb4926d69da6713c2', previewUrl: 'https://example.com/hello-preview', totalVotes: 300, votesPerGroup: { 1: 2, 2: 8 }, submitDate: new Date('2015-10-23'), submittedBy: 7 },
    { id: '0sfdiwck2xr4PteGOdyOfz', title: 'Shot in the Dark', artist: 'AC/DC', year: 2020, img: 'https://i.scdn.co/image/ab67616d00001e0204db0e3bcd166c1d6cfd81f9', previewUrl: 'https://example.com/shot-in-the-dark-preview', totalVotes: 75, votesPerGroup: { 1: 1, 4: 10 }, submitDate: new Date('2020-10-07'), submittedBy: 2 }
  ];

  const votingRecords = [
    { userId: 1, submitted: true, votedSongs: [1, 4], groups: [1] },
    { userId: 2, submitted: false, votedSongs: [], groups: [2] },
    { userId: 3, submitted: false, votedSongs: [2], groups: [1] },
  ];

  // Upsert songs
  for (const song of songs) {
    await Song.updateOne({ id: song.id }, { $setOnInsert: song }, { upsert: true });
  }

  // Upsert voting records
  for (const record of votingRecords) {
    await VotingRecord.updateOne({ userId: record.userId }, { $setOnInsert: record }, { upsert: true });
  }
}

//FETCH TO GET HTML FROM SPOTIFY
// insertDefaultsMongo();

// API routes
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get voting records per user id
app.get('/votingRecords/:userId', async (req, res) => {
  try {
    const votingRecord = await VotingRecord.findOne({ userId: req.params.userId });
    res.json(votingRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/sortedVotedSongs', async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        // Convert the votesPerGroup map to an array of key-value pairs
        $addFields: {
          votesPerGroupArray: { $objectToArray: "$votesPerGroup" }
        }
      },
      { $unwind: "$votesPerGroupArray" },
      {
        // Sort by group ID first (if needed to ensure group order) and then by votes descending
        $sort: {
          "votesPerGroupArray.k": 1,
          "votesPerGroupArray.v": -1
        }
      },
      {
        // Group by group ID and push the songs into an array
        $group: {
          _id: "$votesPerGroupArray.k",
          songs: {
            $push: {
              id: "$id",
              title: "$title",
              artist: "$artist",
              img: "$img",
              previewUrl: "$previewUrl",
              votes: "$votesPerGroupArray.v"
            }
          }
        }
      },
      // Sort by group ID
      { $sort: { "_id": 1 } },
      {
        // Project the final result
        $project: {
          _id: 0,
          group: "$_id",
          songs: { $slice: ["$songs", 10] }
        }
      }
    ]);
    res.json(songs);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.get('/reportSongs/:songId', async (req, res) => {
  try {
    const reports = await ReportSong.find({ songId: req.params.songId });
    res.json(reports);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/adminSongs/:userToken', async (req, res) => {
  try {
    // Query all proposed songs
    const songs = await Song.find();

    // Iterate through each song
    const songsWithReports = await Promise.all(songs.map(async (song) => {

      // Find the reports associted to the song
      const reports = await ReportSong.find({ songId: song.id });

      // Find the user that proposed the song
      const user = await comManager.showUser(req.params.userToken, song.submittedBy);

      // Transform the mongoose.Document into an object
      song = song.toObject();

      // Add reports and user associated to the song
      song.reports = reports;
      song.user = user;

      return song;
    }));

    res.json(songsWithReports);

  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/users/:userToken', async (req, res) => {
  try {
    let users = await comManager.getUsers(req.params.userToken);
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/publicGroups', async (req, res) => {
  try {
    const groups = await comManager.getPublicGroups();
    res.json(groups);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.post('/addGroupsToUser', async (req, res) => {
  try {
    const response = await comManager.setUserGroups(req.body.userId, req.body.token, req.body.groups);
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
})
app.get('/bells/:userToken', async (req, res) => {
  try {
    let bells = await comManager.getBells(req.params.userToken);
    res.json(bells);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/logout', async (req, res) => {
  try {
    let response = await comManager.logout(req.body.token);
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.post('/userInfo', async (req, res) => {
  try {
    let response = await comManager.getUserInfo(req.body.token);
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
})

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
let spotifyToken = '';

// Función para obtener y actualizar el token de Spotify
async function obtenerActualizarTokenSpotify() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', {
      grant_type: 'client_credentials',
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret,
    }, { headers });
    if (response.data.access_token) {
      spotifyToken = response.data.access_token;
    } else {
      console.error('No se pudo obtener el token de Spotify.');
    }
  } catch (error) {
    console.error('Error al obtener el token de Spotify:', error);
  }
}

// Obtener y actualizar el token de Spotify cada 59 minutos
setInterval(obtenerActualizarTokenSpotify, 59 * 60 * 1000);

// Obtener y actualizar el token de Spotify al iniciar el servidor
obtenerActualizarTokenSpotify();

let dirPC = null;

// Sockets
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('googleLogin', (userToken) => {
    comManager.googleLogin(userToken)
      .then((userData) => {

        let groups = [];
        // Populate groups array with group_id and course
        userData.user.groups.forEach(group => {
          let groupObject = {
            group_id: group.pivot.group_id,
            course: group.pivot.course,
          }
          groups.push(groupObject);
        });

        socket.emit('loginData', userData.user.id, userData.user.email, userData.user.name, userData.token, groups);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // Post song checking for duplicates first
  socket.on('postSong', async (userToken, songData) => {
    console.log("user", userToken);
    console.log("POST SONG", songData);
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    // TODO: songData does not include the year of the song, it should

    try {
      // Check if the song already exists
      const existingSong = await Song.findOne({ id: songData.id });
      if (existingSong) {
        socket.emit('postError', { status: 'error', message: 'Song already exists' });
        return;
      }

      // Check if the user already submitted a song
      const votingRecord = await VotingRecord.findOne({ userId: user.id });
      if (votingRecord && votingRecord.submitted) {
        socket.emit('postError', { status: 'error', message: 'User already submitted a song' });
        return;
      }

      // Save the song and update the voting record
      const newSong = new Song(songData);
      await newSong.save();

      console.log("song posted");

      if (!votingRecord) {
        let userGroups = user.groups.map(group => group.id);
        await new VotingRecord({ userId: user.id, submitted: true, votedSongs: [], groups: userGroups }).save();
        // await new VotingRecord({ userId: user.id, submitted: false, votedSongs: [], groups: userGroups }).save();
      } else {
        votingRecord.submitted = true;
        // votingRecord.submitted = false;
        await votingRecord.save();
      }

      io.emit('songPosted', { status: 'success', song: songData });
    } catch (err) {
      socket.emit('postError', { status: 'error', message: err.message });
      console.error('postError', err.message);
    }
  });

  // Cast a vote for a song
  socket.on('castVote', async (userToken, songId) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    try {
      // Check if the song exists
      const song = await Song.findOne({ id: songId });
      if (!song) {
        socket.emit('voteError', { status: 'error', message: 'Song not found' });
        return;
      }

      // Check if the user wants to undo the vote
      const votingRecord = await VotingRecord.findOne({ userId: user.id });
      if (votingRecord && votingRecord.votedSongs.includes(songId)) {
        song.totalVotes -= 1;
        // Update the song with the new vote count per group
        user.groups.forEach(group => {
          let votes = song.votesPerGroup.get(group.id.toString());
          if (votes > 0) {
            song.votesPerGroup.set(group.id.toString(), votes - 1);
          }
        })
        await song.save();

        votingRecord.votedSongs = votingRecord.votedSongs.filter(id => id !== songId);
        await votingRecord.save();

        io.emit('voteCasted', { status: 'success', song });
        return;
      }

      // Check if the user already voted twice
      if (votingRecord && votingRecord.votedSongs.length > 1) {
        socket.emit('voteError', { status: 'error', message: 'User already voted' });
        return;
      }

      // Save the vote and update the voting record
      song.totalVotes += 1;
      // Update the song with the new vote count per group
      user.groups.forEach(group => {
        let votes = song.votesPerGroup.get(group.id.toString());
        if (votes > 0) {
          song.votesPerGroup.set(group.id.toString(), votes + 1);
        } else {
          song.votesPerGroup.set(group.id.toString(), 1);
        }
      })
      await song.save();

      if (!votingRecord) {
        let userGroups = user.groups.map(group => group.id);
        await new VotingRecord({ userId: user.id, submitted: false, votedSongs: [songId], groups: userGroups }).save();
      } else {
        votingRecord.votedSongs.push(songId);
        await votingRecord.save();
      }

      io.emit('voteCasted', { status: 'success', song });
    } catch (err) {
      socket.emit('voteError', { status: 'error', message: err.message });
    }
  });

  // Get all songs from the blacklist
  socket.on('getBlacklist', async (userToken) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = await comManager.getUserInfo(userToken);
    if (!user.id || user.is_admin === 0) return;

    try {
      // Get songs from database
      const response = await comManager.getBlackList(userToken);
      const songs = await response.json();
      socket.emit('sendBlacklist', songs);
    } catch (err) {
      socket.emit('getBlacklistError', { status: 'error', message: err.message });
    }
  });

  // remove a song from the blacklist
  socket.on('removeFromBlacklist', async (userToken, songId) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = await comManager.getUserInfo(userToken);
    if (!user.id || user.is_admin === 0) return;

    try {
      // Check if the song exists and delete it
      await Song.findOneAndDelete({ id: songId });

      await comManager.removeSongFromBlacklist(userToken, songId);

      socket.emit('songRemovedFromBlacklist', songId);
    } catch (err) {
      socket.emit('deleteError', { status: 'error', message: err.message });
    }
  });

  // Delete a song
  socket.on('deleteSong', async (userToken, songId) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = await comManager.getUserInfo(userToken);
    if (!user.id || user.is_admin === 0) return;
    console.log("song id", songId);
    try {
      // Check if the song exists and delete it
      const song = await Song.findOneAndDelete({ id: songId });
      if (!song) {
        socket.emit('deleteError', { status: 'error', message: 'Song not found' });
        return;
      }
      console.log("in index", song);
      comManager.addSongToBlackList(userToken, song);

      io.emit('songDeleted', { status: 'success', song: song });
    } catch (err) {
      socket.emit('deleteError', { status: 'error', message: err.message });
    }
  });

  // Report a song
  socket.on('reportSong', async (userToken, reportedSong) => {

    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    try {
      // Check if the song exists
      const song = await Song.findOne({ id: reportedSong.songId });
      if (!song) {
        socket.emit('reportError', { status: 'error', message: 'Song not found' });
        return;
      }

      // Add a register in ReportSong table
      await new ReportSong({ userId: user.id, userName: user.name, songId: song.id, reason: reportedSong.option, isRead: false }).save();

      io.emit('songReported', { status: 'success', message: `La cançó ${song.name} ha sigut reportada` });
    } catch (err) {
      socket.emit('reportError', { status: 'error', message: err.message });
    }
  });

  socket.on('getHtmlSpotify', (songId) => {
    comManager.fetchSpotifyPage(songId).then(html => {
      if (html) {
        socket.emit('sendHtmlSpotify', html, songId);
      }
    });
  });


  socket.on('getTopSongs', (playlist) => {
    let limit = 1;
    let songsToEmit = [];
    comManager.getPlaylists(playlist, limit, spotifyToken)
      .then(data => {
        if (data) {
          data.items.forEach(song => {
            songsToEmit.push(song.track);
          });
          socket.emit('topSongs', songsToEmit);
        }
      });
  });

  socket.on('searchId', (id) => {
    comManager.searchSongId(id, spotifyToken)
      .then(data => {
        if (data) {
          socket.emit('searchResultId', data);
        }
      });
  });

  socket.on('getGroups', (token) => {
    comManager.getGroups(token)
      .then((groups) => {
        socket.emit('sendGroups', groups);
      })
      .catch((err) => {
        console.error(err);
      });
  })

  socket.on('deleteGroup', (token, groupId) => {
    comManager.deleteGroup(token, groupId)
      .then((response) => {
        socket.emit('groupDeleted', response);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  socket.on('updateGroup', (token, groupName) => {
    comManager.updateGroup(token, groupName)
      .then((response) => {
        socket.emit('groupUpdated', response);
      })
      .catch((err) => {
        console.error(err);
      });
  });


  socket.on('getTopSongs', (playlist) => {
    let limit = 1;
    let songsToEmit = [];
    comManager.getPlaylists(playlist, limit, spotifyToken)
      .then(data => {
        if (data) {
          data.items.forEach(song => {
            songsToEmit.push(song.track);
          });
          socket.emit('topSongs', songsToEmit);
        }
      });
  });

  socket.on('searchSong', (search) => {
    let limit = 15;
    comManager.searchSong(search, limit, spotifyToken)
      .then(data => {
        if (data) {
          socket.emit('searchResult', data.tracks.items);
        }
      });

  });

  socket.on('searchId', (id) => {
    comManager.searchSongId(id, spotifyToken)
      .then(data => {
        if (data) {
          socket.emit('searchResultId', data);
        }
      });
  });

  socket.on('banUser', async (userToken, bannedUser) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = await comManager.getUserInfo(userToken);
    if (!user.id || user.role_id !== 1) return;

    try {
      // Ban user
      comManager.banUser(userToken, bannedUser);

      io.emit('userBanned', { status: 'success', message: `L'usuari' ${bannedUser.name} ha sigut bloquejat` });
    } catch (err) {
      socket.emit('reportError', { status: 'error', message: err.message });
    }
  });

  socket.on('updateBellsGroupsRelations', async (userToken, bells) => {

    try {
      let response = await comManager.setBellsGroupsConfiguration(userToken, bells);
      io.emit('bellsGroupsRelationsUpdated', { status: 'success', message: response });
    } catch (err) {
      socket.emit('updateBellsGroupsRelationsError', { status: 'error', message: err.message });
    }
  });

  socket.on('dirPC', () => {
    dirPC = socket.id;
    socket.emit('dirPCStatus', true);
  });

  socket.on('sendBells', () => {
    if (dirPC) {
      io.to(dirPC).emit('executeSendBells',);
    }
  });

  socket.on('getPcStatus', () => {
    if (dirPC) {
      socket.emit('dirPCStatus', true);
    } else {
      socket.emit('dirPCStatus', false);
    }
  });

  socket.on('changeIsReadReportStatus', async (userToken, report) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

    // Find the report
    const reportSong = await ReportSong.findOne({ _id: report._id });
    reportSong.isRead = report.isRead;
    await reportSong.save();
    io.emit('isReadReportStatusChanged', { status: 'success', message: `El report amb id ${reportSong._id} ha canviat.` });
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (socket.id === dirPC) {
      dirPC = null;
      socket.emit('dirPCStatus', false);
    }
  });

  socket.on('testing', (data) => {
    socket.emit('testing', data);
  });

});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { port };