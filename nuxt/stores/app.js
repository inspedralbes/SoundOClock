import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: {
      id: 0,
      email: "",
      name: "",
      group: "",
      token: null
    },

    userSelectedSongs: null,
    proposedSongs: [],
    proposedSongsAdminView: [],
    usersAdminView: [],
    filter: 1,
    searchEngineFilter: "",
    isLoadingVote: false,
    adminSelectedUser: null

  }),
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
    getAdminSelectedUser() {
      return this.adminSelectedUser
    },

    //setters
    setUser(id, email, name, group, token) {
      this.user.id = id;
      this.user.email = email;
      this.user.name = name;
      this.user.group = group;
      this.user.token = token;

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
    setAdminSelectedUser(adminSelectedUser) {
      this.adminSelectedUser = adminSelectedUser
    },
  },
})
