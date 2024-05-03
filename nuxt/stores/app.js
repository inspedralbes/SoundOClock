import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: typeof window !== 'undefined' && window.localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')) : {
        id: 0,
        email: "",
        name: "",
        groups: [],
        token: null,
        role_id: null
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
    admin:{
      selected_screen:0
    },
    roles: [],
    serverResponse: null,
    loadingAdminComponent: null,
    blacklist: [],
    settings:{}
  }),
  persist: {
    storage: persistedState.localStorage,
    paths: ['user','admin']
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
    getServerResponse() {
      return this.serverResponse
    },
    getLoadingAdminComponent() {
      return this.loadingAdminComponent
    },
    getBlacklist() {
      return this.blacklist
    },

    //setters
    setUser(id, email, name, token, groups, role_id) {
      this.user.id = id;
      this.user.email = email;
      this.user.name = name;
      this.user.groups = groups;
      this.user.token = token;
      this.user.role_id = role_id;

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
      this.roles = roles
    },
    setServerResponse(serverResponse) {
      this.serverResponse = serverResponse
    },
    setLoadingAdminComponent(loadingAdminComponent) {
      this.loadingAdminComponent = loadingAdminComponent
    },
    setBlacklist(blacklist) {
      this.blacklist = blacklist
    },
    setAdminSelectedScreen(screen) {
      this.admin.selected_screen = screen
    },
    setSettings(settings) {
      this.settings = settings
    },

    ///Deletes
    deleteUser() {
      this.user = {
        id: 0,
        email: "",
        name: "",
        groups: [],
        token: null,
        role_id: null
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

    // Other 
    
    playTrack(track) {
      const status = this.songStatus;
      if (status.currentTrackId == track.id) {
        if (status.isPlaying) {
          status.currentTrack.pause();
          status.isPlaying = false;
        } else {
          this.songStatus.currentTrack.load();
          this.songStatus.currentTrack.play();
          this.songStatus.isPlaying = true;
        }
      } else {
        if (this.songStatus.isPlaying) {
          this.songStatus.currentTrack.pause();
          this.songStatus.isPlaying = false;
        }
        this.songStatus.currentTrack = new Audio(track.preview_url);
        this.songStatus.currentTrackId = track.id;
        this.songStatus.currentTrack.load();
        this.songStatus.currentTrack.play();
        this.songStatus.isPlaying = true;
      }
      return this.songStatus;
    },
  },
})
