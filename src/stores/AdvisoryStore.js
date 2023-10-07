import axios from 'axios';
import { defineStore } from 'pinia';
import { useLoaderStore } from './LoaderStore';

export const useAdvisoryStore = defineStore('advisory', {
  state: () => ({
    newAdvisory: {
      event: {},
      selectedHour: {},
      studentAccount: ''
    },
    studentSelected: {}
  }),
  actions: {
    async getStudent(studentAccount) {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/students/${studentAccount}`);
        this.studentSelected = data;
      } catch (error) {
        console.log(error);
      }
    },
    async enrollStudent() {
      useLoaderStore().loading = true;

      try {
        await axios.post(`http://localhost:8000/api/v1/advisories`, this.newAdvisory);
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    clearNewAdvisory() {
      this.newAdvisory = {
        event: {},
        selectedHour: {},
        studentAccount: ''
      };
    },
    clearStudentSelected() {
      this.studentSelected = {};
    }
  }
});
