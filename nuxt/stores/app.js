import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: {
      email: "",
      name: ""
    },
    proposedSongs: [],
    filter: 1,
    searchEngineFilter: "",
    loading: false,

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
    getLoading() {
      return this.loading
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
    },
    setLoading(loading) {
      this.loading = loading
    },

  },
})
