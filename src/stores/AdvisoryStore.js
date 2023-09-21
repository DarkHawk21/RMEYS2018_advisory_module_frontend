import { defineStore } from 'pinia';

export const useAdvisoryStore = defineStore('advisory', {
  state: () => ({
    newAdvisory: {
      date: '',
      startTime: null,
      endTime: null,
      studentAccount: ''
    }
  }),
  actions: {
    clearSelection() {
      this.newAdvisory = {
        date: '',
        startTime: null,
        endTime: null,
        studentAccount: ''
      };
    }
  }
});
