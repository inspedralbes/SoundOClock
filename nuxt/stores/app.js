import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: '',
    proposedSongs: [],
    filter: null,
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
    setUser(user) {
      this.user = user
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
