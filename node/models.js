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
  group: Number,
  submitted: { type: Boolean, default: false },
  votedSongs: [Number],
});

const reportSongSchema = new mongoose.Schema({
  userId: Number,
  songId: Number,
  reason: String
});

const VotingRecord = mongoose.model('VotingRecord', votingRecordSchema);
const Song = mongoose.model('Song', songSchema);
const ReportSong = mongoose.model('ReportSong', reportSongSchema);

export { Song, VotingRecord, ReportSong }