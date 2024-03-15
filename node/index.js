import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { getUserInfo } from './communicationManager.js';
import { Song, VotingRecord } from './models.js';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
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
    { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop', year: 2020, votes: 150, submitDate: new Date('2020-11-29'), submittedBy: 'User1' },
    { id: 2, title: 'Shot in the Dark', artist: 'AC/DC', genre: 'Rock', year: 2020, votes: 75, submitDate: new Date('2020-10-07'), submittedBy: 'User2' },
    { id: 3, title: 'Don\'t Start Now', artist: 'Dua Lipa', genre: 'Pop', year: 2019, votes: 200, submitDate: new Date('2019-11-01'), submittedBy: 'User3' },
    { id: 4, title: 'Fear Inoculum', artist: 'Tool', genre: 'Rock', year: 2019, votes: 90, submitDate: new Date('2019-08-30'), submittedBy: 'User4' },
    { id: 5, title: 'God\'s Plan', artist: 'Drake', genre: 'Pop', year: 2018, votes: 250, submitDate: new Date('2018-01-19'), submittedBy: 'User5' },
    { id: 6, title: 'HARDWIRE', artist: 'Metallica', genre: 'Rock', year: 2016, votes: 65, submitDate: new Date('2016-08-18'), submittedBy: 'User6' },
    { id: 7, title: 'Hello', artist: 'Adele', genre: 'Pop', year: 2015, votes: 300, submitDate: new Date('2015-10-23'), submittedBy: 'User7' },
    { id: 8, title: 'Doom and Gloom', artist: 'The Rolling Stones', genre: 'Rock', year: 2012, votes: 80, submitDate: new Date('2012-10-11'), submittedBy: 'User8' },
    { id: 9, title: 'Royals', artist: 'Lorde', genre: 'Pop', year: 2013, votes: 220, submitDate: new Date('2013-03-08'), submittedBy: 'User9' },
    { id: 10, title: 'R U Mine?', artist: 'Arctic Monkeys', genre: 'Rock', year: 2013, votes: 110, submitDate: new Date('2013-02-27'), submittedBy: 'User10' }
  ];

  const votingRecords = [
    { userId: 1, submitted: true, votedSongs: [1, 4] },
    { userId: 2, submitted: false, votedSongs: [] },
    { userId: 3, submitted: false, votedSongs: [2] },
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

// Sockets
io.on('connection', (socket) => {
  console.log('a user connected');

  // Post song checking for duplicates first
  socket.on('postSong', async (userToken, songData) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = getUserInfo(userToken);
    if (user.message) return;
  
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
        await new VotingRecord({ userId: user.id, submitted: true, votedSongs: [] }).save();
      } else {
        votingRecord.submitted = true;
        await votingRecord.save();
      }
  
      io.emit('songPosted', { status: 'success', song: songData });
    } catch (err) {
      socket.emit('postError', { status: 'error', message: err.message });
    }
  });

  // Cast a vote for a song
  socket.on('castVote', async (userToken, songId) => {
    // Check that the user is authenticated with Laravel Sanctum
    let user = await getUserInfo(userToken);
    if (user.message) return;
  
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
        await new VotingRecord({ userId: user.id, submitted: false, votedSongs: [songId] }).save();
      } else {
        votingRecord.votedSongs.push(songId);
        await votingRecord.save();
      }
  
      io.emit('voteCasted', { status: 'success', song });
    } catch (err) {
      socket.emit('voteError', { status: 'error', message: err.message });
    }
  });

  // Delete a song
  socket.on('deleteSong', async (userToken, songId) => {
    // Check that the user is authenticated with Laravel Sanctum and is an admin
    let user = getUserInfo(userToken);
    if (user.message || user.is_admin === 0) return;
  
    try {
      // Check if the song exists and delete it
      const song = await Song.findOneAndDelete({ id: songId });
      if (!song) {
        socket.emit('deleteError', { status: 'error', message: 'Song not found' });
        return;
      }
  
      io.emit('songDeleted', { status: 'success', id: songId });
    } catch (err) {
      socket.emit('deleteError', { status: 'error', message: err.message });
    }
  });

  // Testing
  socket.on('testing', (num) => {
    socket.emit('testing', {num: num});
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { server };