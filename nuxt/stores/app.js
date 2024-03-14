import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: {
      email: "",
      name: ""
    },
    proposedSongs: [],
    filter: 1,
    searchEngineFilter: ""

  }),
  actions: {

    //getters
    getUser() {
      return this.user
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

    //setters
    setUser(email, name) {
      this.user.email = email;
      this.user.name = name;
    },
    setProposedSongs(proposedSongs) {
      this.proposedSongs = proposedSongs
    },
    setFilter(filter) {
      this.filter = filter
    },
    setSearchEngineFilter(searchEngineFilter) {
      this.searchEngineFilter = searchEngineFilter
    }

  },
})
