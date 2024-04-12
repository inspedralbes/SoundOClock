import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  id: String,
  title: String,
  artist: String,
  year: Number,
  img: String,
  previewUrl: String,
  totalVotes: { type: Number, default: 0 },
  votesPerGroup: { type: Map, of: Number, default: new Map()},
  submitDate: Date,
  submittedBy: Number,
});

const votingRecordSchema = new mongoose.Schema({
  userId: Number,
  groups: [Number],
  submitted: { type: Boolean, default: false },
  votedSongs: [String],
});

const reportSongSchema = new mongoose.Schema({
  userId: Number,
  userName: String,
  songId: String,
  reason: String,
  isRead: Boolean,
});

const VotingRecord = mongoose.model('VotingRecord', votingRecordSchema);
const Song = mongoose.model('Song', songSchema);
const ReportSong = mongoose.model('ReportSong', reportSongSchema);

export { Song, VotingRecord, ReportSong }