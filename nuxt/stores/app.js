import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: {
      email: "",
      name: "",
      token: ""
    },

    userSelectedSongs: null,
    proposedSongs: [],
    filter: 1,
    searchEngineFilter: "",
    isLoadingVote: false

  }),
  actions: {

    //getters
    getUserSelectedSongs() {
      return this.userSelectedSongs
    },
    getProposedSongs() {
      return this.proposedSongs
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

    getUser() {
      return this.user
    },

    //setters
    setUser(email, name, token) {
      this.user.email = email;
      this.user.name = name;
      this.user.token = token;
    },

    setUserSelectedSongs(userSelectedSongs) {
      this.userSelectedSongs = userSelectedSongs

    },
    setProposedSongs(proposedSongs) {
      this.proposedSongs = proposedSongs
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

  },
})
