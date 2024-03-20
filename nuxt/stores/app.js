import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: {
      id: 0,
      email: "",
      name: "",
      group: "",
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
    getUser() {
      return this.user
    },
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

    //setters
    setUser(id, email, name, group, token) {
      this.user.id = id;
      this.user.email = email;
      this.user.name = name;
      this.user.group = group;
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
