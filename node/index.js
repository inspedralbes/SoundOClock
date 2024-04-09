import express from 'express';
import { createServer, get } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import comManager from './communicationManager.js';
import { Song, VotingRecord, ReportSong } from './models.js';
import axios from 'axios';

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
mongoose.connect('mongodb://mongoadmin:mongopassword@mongodb:27017/soundoclock', {
  authSource: "admin" // This is needed if you're using credentials to connect to MongoDB
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function insertDefaultsMongo() {
  const songs = [
    { id: '0VjIjW4GlUZAMYd2vXMi3b', title: 'Blinding Lights', artist: 'The Weeknd', year: 2020, img: 'https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36', previewUrl: 'https://example.com/blinding-lights-preview', votes: 150, submitDate: new Date('2020-11-29'), submittedBy: 1 },
    { id: '62PaSfnXSMyLshYJrlTuL3', title: 'Hello', artist: 'Adele', year: 2015, img: 'https://i.scdn.co/image/ab67616d00001e0247ce408fb4926d69da6713c2', previewUrl: 'https://example.com/hello-preview', votes: 300, submitDate: new Date('2015-10-23'), submittedBy: 7 },
    { id: '0sfdiwck2xr4PteGOdyOfz', title: 'Shot in the Dark', artist: 'AC/DC', year: 2020, img: 'https://i.scdn.co/image/ab67616d00001e0204db0e3bcd166c1d6cfd81f9', previewUrl: 'https://example.com/shot-in-the-dark-preview', votes: 75, submitDate: new Date('2020-10-07'), submittedBy: 2 },
    //     { id: 3, title: 'Don\'t Start Now', artist: 'Dua Lipa', year: 2019, img: 'dont-start-now.jpg', previewUrl: 'https://example.com/dont-start-now-preview', votes: 200, submitDate: new Date('2019-11-01'), submittedBy: 3 },
    //     { id: 4, title: 'Fear Inoculum', artist: 'Tool', year: 2019, img: 'fear-inoculum.jpg', previewUrl: 'https://example.com/fear-inoculum-preview', votes: 90, submitDate: new Date('2019-08-30'), submittedBy: 4 },
    //     { id: 5, title: 'God\'s Plan', artist: 'Drake', year: 2018, img: 'gods-plan.jpg', previewUrl: 'https://example.com/gods-plan-preview', votes: 250, submitDate: new Date('2018-01-19'), submittedBy: 5 },
    //     { id: 6, title: 'HARDWIRE', artist: 'Metallica', year: 2016, img: 'hardwire.jpg', previewUrl: 'https://example.com/hardwire-preview', votes: 65, submitDate: new Date('2016-08-18'), submittedBy: 6 },
    //     { id: 8, title: 'Doom and Gloom', artist: 'The Rolling Stones', year: 2012, img: 'doom-and-gloom.jpg', previewUrl: 'https://example.com/doom-and-gloom-preview', votes: 80, submitDate: new Date('2012-10-11'), submittedBy: 8 },
    //     { id: 9, title: 'Royals', artist: 'Lorde', year: 2013, img: 'royals.jpg', previewUrl: 'https://example.com/royals-preview', votes: 220, submitDate: new Date('2013-03-08'), submittedBy: 9 },
    //     { id: 10, title: 'R U Mine?', artist: 'Arctic Monkeys', year: 2013, img: 'r-u-mine.jpg', previewUrl: 'https://example.com/r-u-mine-preview', votes: 110, submitDate: new Date('2013-02-27'), submittedBy: 10 }
  ];

  const votingRecords = [
    { userId: 1, submitted: true, votedSongs: [1, 4], group: 1 },
    { userId: 2, submitted: false, votedSongs: [], group: 2 },
    { userId: 3, submitted: false, votedSongs: [2], group: 1 },
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


insertDefaultsMongo();

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

app.get('/reportSongs/:songId', async (req, res) => {
  try {
    const reports = await ReportSong.find({ songId: req.params.songId });
    res.json(reports);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/adminSongs', async (req, res) => {
  try {
    // Query all songs
    const songs = await Song.find();

    // Iterate through each song and find its reported versions
    const songsWithReports = await Promise.all(songs.map(async (song) => {
      const reports = await ReportSong.find({ songId: song.id });
      song = song.toObject();
      song.reports = reports;
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
    // Check that the user is authenticated with Laravel Sanctum
    let user = await comManager.getUserInfo(userToken);
    if (!user.id) return;

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

      if (!votingRecord) {
        await new VotingRecord({ userId: user.id, submitted: true, votedSongs: [], group: user.class_group_id }).save();
      } else {
        votingRecord.submitted = true;
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
        song.votes -= 1;
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
      song.votes += 1;
      await song.save();

      if (!votingRecord) {
        await new VotingRecord({ userId: user.id, submitted: false, votedSongs: [songId], group: user.class_group_id }).save();
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
  socket.on('deleteSong', async (userToken, songInfo) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = await comManager.getUserInfo(userToken);
    if (!user.id || user.is_admin === 0) return;

    try {
      // Check if the song exists and delete it
      const song = await Song.findOneAndDelete({ id: songInfo.id });
      if (!song) {
        socket.emit('deleteError', { status: 'error', message: 'Song not found' });
        return;
      }

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
      await new ReportSong({ userId: user.id, userName: user.name, songId: song.id, reason: reportedSong.option }).save();

      io.emit('songReported', { status: 'success', message: `La cançó ${song.title} ha sigut reportada` });
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

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('testing', (data) => {
    socket.emit('testing', data);
  });

});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { port };