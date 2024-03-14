import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    userSelectedSongs: null,
    proposedSongs: [],
    filter: 1,
    searchEngineFilter: ""

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

    //setters
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
    }

  },
})
