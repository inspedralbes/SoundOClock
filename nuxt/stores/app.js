import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: '',
    filter: null,

  }),
  actions: {

    //getters
    getUser() {
      return this.user
    },
    getFilter() {
      return this.filter
    },

    //setters
    setUser(user) {
      this.user = user
    },
    setFilter(filter) {
      this.filter = filter
    }

  },
})
