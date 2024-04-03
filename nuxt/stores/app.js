import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    user: typeof window !== 'undefined' && window.localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')) : {
        id: 0,
        email: "",
        name: "",
        group: "",
        course: "",
        token: null
      },

    userSelectedSongs: null,
    proposedSongs: [],
    proposedSongsAdminView: [],
    filter: 1,
    searchEngineFilter: "",
    isLoadingVote: false,
    classGroups: [],
    openMenu: false

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

    //setters
    setUser(id, email, name, group, course, token) {
      this.user.id = id;
      this.user.email = email;
      this.user.name = name;
      this.user.group = group;
      this.user.course = course;
      this.user.token = token;

      localStorage.setItem("user", JSON.stringify(this.user));
    },
    setUserGroupAndCourse(group, course) {
      this.user.group = group;
      this.user.course = course;

      localStorage.setItem("user", JSON.stringify(this.user));
    },
    setUserSelectedSongs(userSelectedSongs) {
      this.userSelectedSongs = userSelectedSongs
    },
    setProposedSongs(proposedSongs) {
      this.proposedSongs = proposedSongs
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
    }
  },
})
