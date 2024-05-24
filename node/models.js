import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  id: String,
  name: String,
  artists: [Object],
  year: Number,
  img: String,
  preview_url: String,
  link: String,
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
  link: String,
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
  link: String,
  selectedDate: Date,
  userId: Number,
});

const reportUserSchema = new mongoose.Schema({
  userId: String,
  groupId: Number,
  isRead: Boolean,
});

const bellsGroupsTemplate = new mongoose.Schema({
  name: String,
  bellsGroups: [Object],
});

const themeModals = new mongoose.Schema({
  userId: Number,
  modalsShown: { type: Map, of: Boolean, default: new Map() },
})

const VotingRecord = mongoose.model("VotingRecord", votingRecordSchema);
const Song = mongoose.model("Song", songSchema);
const ReportSong = mongoose.model("ReportSong", reportSongSchema);
const SelectedSong = mongoose.model("SelectedSong", selectedSongSchema);
const ReportUser = mongoose.model("ReportUser", reportUserSchema);
const BellsGroupsTemplate = mongoose.model(
  "BellsGroupsTemplate",
  bellsGroupsTemplate
);
const ThemeModals = mongoose.model("ThemeModals", themeModals);

export {
  Song,
  VotingRecord,
  ReportSong,
  SelectedSong,
  ReportUser,
  BellsGroupsTemplate,
  ThemeModals,
};
