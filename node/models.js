import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  id: String,
  name: String,
  artists: [Object],
  year: Number,
  img: String,
  preview_url: String,
  explicit: Boolean,
  totalVotes: { type: Number, default: 0 },
  votesPerGroup: { type: Map, of: Number, default: new Map() },
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
  reasons: [String],
  isRead: Boolean,
});

const selectedSongSchema = new mongoose.Schema({
  id: String,
  bellId: Number,
  name: String,
  artists: [Object],
  img: String,
  preview_url: String,
  selectedDate: Date,
});

const reportUserSchema = new mongoose.Schema({
  userId: String,
  groupId: Number,
  isRead: Boolean,
});

const VotingRecord = mongoose.model('VotingRecord', votingRecordSchema);
const Song = mongoose.model('Song', songSchema);
const ReportSong = mongoose.model('ReportSong', reportSongSchema);
const SelectedSong = mongoose.model('SelectedSong', selectedSongSchema);
const ReportUser = mongoose.model('ReportUser', reportUserSchema);

export { Song, VotingRecord, ReportSong, SelectedSong, ReportUser }