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
    studentSelected: {},
    selectedHourQuote: 0,
    studentIsEnrolledAtThisHour: false
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
    async getAdvisoryDisponibility(scheduleEventId, selectedDate, selectedTimeStart) {
      useLoaderStore().loading = true;

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisories/${scheduleEventId}/${selectedDate}/${selectedTimeStart}/disponibility`);
        this.selectedHourQuote = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async getIfStudentIsEnrolledAtThisHour(scheduleEventId, selectedDate, selectedTimeStart, studentAccount) {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisories/${scheduleEventId}/${selectedDate}/${selectedTimeStart}/disponibility/${studentAccount}`);
        this.studentIsEnrolledAtThisHour = data.id ? true : false;
      } catch (error) {
        console.log(error);
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
