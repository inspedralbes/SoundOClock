const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { getUserInfo } = require('./communicationManager');

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
const port = process.env.PORT || 8080;

let songVotes = {};
let votingRecords = {};

songVotes = {
  // key: songId
  1: { title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop', year: 2020, votes: 150, submitDate: new Date('2020-11-29'), submittedBy: 'User1' },
  2: { title: 'Shot in the Dark', artist: 'AC/DC', genre: 'Rock', year: 2020, votes: 75, submitDate: new Date('2020-10-07'), submittedBy: 'User2' },
  3: { title: 'Don\'t Start Now', artist: 'Dua Lipa', genre: 'Pop', year: 2019, votes: 200, submitDate: new Date('2019-11-01'), submittedBy: 'User3' },
  4: { title: 'Fear Inoculum', artist: 'Tool', genre: 'Rock', year: 2019, votes: 90, submitDate: new Date('2019-08-30'), submittedBy: 'User4' },
  5: { title: 'God\'s Plan', artist: 'Drake', genre: 'Pop', year: 2018, votes: 250, submitDate: new Date('2018-01-19'), submittedBy: 'User5' },
  6: { title: 'HARDWIRE', artist: 'Metallica', genre: 'Rock', year: 2016, votes: 65, submitDate: new Date('2016-08-18'), submittedBy: 'User6' },
  7: { title: 'Hello', artist: 'Adele', genre: 'Pop', year: 2015, votes: 300, submitDate: new Date('2015-10-23'), submittedBy: 'User7' },
  8: { title: 'Doom and Gloom', artist: 'The Rolling Stones', genre: 'Rock', year: 2012, votes: 80, submitDate: new Date('2012-10-11'), submittedBy: 'User8' },
  9: { title: 'Royals', artist: 'Lorde', genre: 'Pop', year: 2013, votes: 220, submitDate: new Date('2013-03-08'), submittedBy: 'User9' },
  10: { title: 'R U Mine?', artist: 'Arctic Monkeys', genre: 'Rock', year: 2013, votes: 110, submitDate: new Date('2013-02-27'), submittedBy: 'User10' }
}

votingRecords = {
  // key: userId
  1: { submitted: true, votedSongs: [1, 4] },
  2: { submitted: false, votedSongs: [] },
  3: { submitted: false, votedSongs: [2] },
}

// API routes
// Get all proposed songs
app.get('/songs', (req, res) => {
  res.json(songVotes);
});

// Sockets
io.on('connection', (socket) => {
  console.log('a user connected');

  // Post song checking for duplicates first
  socket.on('postSong', (userToken, song) => {

    // Check that the user is authenticated with Laravel Sanctum
    let user = getUserInfo(userToken);

    if (!user) return; // user = { id: 1, name: 'User', isAdmin: boolean}

    // Check if the user already submitted a song
    if (votingRecords[user.id] && votingRecords[user.id].submitted) {
      socket.emit('postError', { status: 'error', message: 'User already submitted a song' });
      return;
    }

    if (songVotes[song.id]) {
      // Respond the error to the sender in case of failure
      socket.emit('postError', { status: 'error', message: 'Song already exists' });
    } else {
      // Store the new song and emit it to all connected clients
      songVotes[song.id] = song;
      votingRecords[user.id].submitted = true;
      io.emit('songPosted', { status: 'success', song });
    }
  });

  // Cast a vote for a song
  socket.on('castVote', (userToken, song) => {

    // Check that the user is authenticated with Laravel Sanctum
    let user = getUserInfo(userToken);

    if (!user) return; // user = { id: 1, name: 'User', isAdmin: false}

    // Check if the user already voted
    if (votingRecords[user.id] && votingRecords[user.id].votedSongs.length > 1) {
      socket.emit('voteError', { status: 'error', message: 'User already voted' });
      return;
    }

    if (songVotes[song.id]) {
      // Store the vote and emit it to all connected clients
      songVotes[song.id].votes += 1;
      votingRecords[user.id].votedSongs.push(song.id);
      io.emit('voteCasted', { status: 'success', song: songVotes[song.id] });
    } else {
      // Respond the error to the sender in case of failure
      socket.emit('voteError', { status: 'error', message: 'Song not found' });
    }

  });

  // Delete a song
  socket.on('deleteSong', (userToken, id) => {
    
    // Check that the user is authenticated with Laravel Sanctum
    let user = getUserInfo(userToken);

    if (!user || !user.isAdmin) return; // user = { id: 1, name: 'User', isAdmin: true}

    if (songVotes[id]) {
      // Remove the song and emit it to all connected clients
      delete songVotes[id];
      io.emit('songDeleted', { status: 'success', id });
    } else {
      // Respond the error to the sender in case of failure
      socket.emit('deleteError', { status: 'error', message: 'Song not found' });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
