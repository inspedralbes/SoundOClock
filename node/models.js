import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  id: Number,
  title: String,
  artist: String,
  genre: String,
  year: Number,
  votes: { type: Number, default: 0 },
  submitDate: Date,
  submittedBy: String,
});

const votingRecordSchema = new mongoose.Schema({
  userId: Number,
  submitted: { type: Boolean, default: false },
  votedSongs: [Number],
});

const VotingRecord = mongoose.model('VotingRecord', votingRecordSchema);
const Song = mongoose.model('Song', songSchema);

export { Song, VotingRecord }