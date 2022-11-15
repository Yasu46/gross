import { defineStore } from 'pinia';

export const userStore = defineStore('user', {
  state: () => ({
    userid: '',
    name: ''
  }),
  getters: {
    getUserId: (state) => {
      return state.userid;
    },
    getFullname: (state) => {
      return state.name;
    },
  },
  actions: {
    clearStore() {
      this.userid = ""
      this.name = ""
    }
  },
});
