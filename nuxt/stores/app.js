import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: typeof window !== 'undefined' && window.localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')) : {
        id: 0,
        email: "",
        name: "",
        groups: [],
        token: null
      },

    userSelectedSongs: [],
    proposedSongs: [],
    sortedVotedSongs: [],
    proposedSongsAdminView: [],
    usersAdminView: [],
    filter: 1,
    searchEngineFilter: "",
    isLoadingVote: false,
    classGroups: [],
    openMenu: false,
    adminSelectedUser: null,
    bells: [],
    currentTrackPlaying: null,
    postedSongStatus: null,
    songStatus: {
      currentTrack: null,
      currentTrackId: null,
      isPlaying: false,
    },
    roles: null,

  }),
  persist: {
    storage: persistedState.localStorage,
    paths: ['user']
  },
  actions: {

    //getters
    getUser() {
      return this.user
    },
    getUserSelectedSongs() {
      return this.userSelectedSongs
    },
    getProposedSongs() {
      return this.proposedSongs
    },
    getProposedSongsAdminView() {
      return this.proposedSongsAdminView
    },
    getUsersAdminView() {
      return this.usersAdminView
    },
    getFilter() {
      return this.filter
    },
    getSearchEngineFilter() {
      return this.searchEngineFilter
    },
    getIsLoadingVote() {
      return this.isLoadingVote
    },
    getClassGroups() {
      return this.classGroups
    },
    getOpenMenu() {
      return this.openMenu
    },
    getAdminSelectedUser() {
      return this.adminSelectedUser
    },
    getCurrentTrackPlaying() {
      return this.currentTrackPlaying
    },
    getBells() {
      return this.bells
    },
    getPostedSongStatus() {
      return this.postedSongStatus
    },
    getSortedVotedSongs() {
      return this.sortedVotedSongs
    },
    getSongStatus() {
      return this.songStatus
    },
    getRoles() {
      return this.roles
    },

    //setters
    setUser(id, email, name, token, groups) {
      this.user.id = id;
      this.user.email = email;
      this.user.name = name;
      this.user.groups = groups;
      this.user.token = token;

      localStorage.setItem("user", JSON.stringify(this.user));
    },
    setUserGroups(groups) {
      this.user.groups = groups;

      localStorage.setItem("user", JSON.stringify(this.user));
    },
    setUserSelectedSongs(userSelectedSongs) {
      this.userSelectedSongs = userSelectedSongs
    },
    setProposedSongs(proposedSongs) {
      this.proposedSongs = proposedSongs
    },
    setUsersAdminView(usersAdminView) {
      this.usersAdminView = usersAdminView
    },
    setProposedSongsAdminView(proposedSongsAdminView) {
      this.proposedSongsAdminView = proposedSongsAdminView
    },
    setFilter(filter) {
      this.filter = filter
    },
    setSearchEngineFilter(searchEngineFilter) {
      this.searchEngineFilter = searchEngineFilter
    },
    setIsLoadingVote(isLoadingVote) {
      this.isLoadingVote = isLoadingVote
    },
    setClassGroups(classGroups) {
      this.classGroups = classGroups
    },
    setOpenMenu(menuState) {
      this.openMenu = menuState
    },
    setCurrentTrackPlaying(currentTrackPlaying) {
      this.currentTrackPlaying = currentTrackPlaying
    },
    setBells(bells) {
      this.bells = bells
    },
    setPostedSongStatus(postedSongStatus) {
      this.postedSongStatus = postedSongStatus
    },
    setSortedVotedSongs(sortedVotedSongs) {
      this.sortedVotedSongs = sortedVotedSongs
    },
    setSongStatus(currentTrack, currentTrackId, isPlaying) {
      this.songStatus.currentTrack = currentTrack
      this.songStatus.currentTrackId = currentTrackId
      this.songStatus.isPlaying = isPlaying
    },
    setRoles(roles) {
      console.log("ROLES", roles)
      this.roles = roles
    },

    ///Deletes
    deleteUser() {
      this.user = {
        id: 0,
        email: "",
        name: "",
        groups: [],
        token: null
      }
    },
    deleteGroup(id) {
      id = parseInt(id);
      this.classGroups = this.classGroups.filter(group => group.id !== id);
    },
    deleteCurrentTrackPlaying() {
      this.currentTrackPlaying = null
    },
    deletePostedSongStatus() {
      this.postedSongStatus = null
    },
    setAdminSelectedUser(adminSelectedUser) {
      this.adminSelectedUser = adminSelectedUser
    },

    // Others

    playTrack(track, status) {
      if (status.currentTrackId == track.id) {
        if (status.isPlaying) {
          status.currentTrack.pause();
          status.isPlaying = false;
        } else {
          status.currentTrack.load();
          status.currentTrack.play();
          status.isPlaying = true;
        }
      } else {
        if (status.isPlaying) {
          status.currentTrack.pause();
          status.isPlaying = false;
        }
        status.currentTrack = new Audio(track.preview_url);
        status.currentTrackId = track.id;
        status.currentTrack.load();
        status.currentTrack.play();
        status.isPlaying = true;
      }
    },
  },
})
