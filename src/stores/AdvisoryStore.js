import axios from 'axios';
import { defineStore } from 'pinia';
import { useLoaderStore } from './LoaderStore';

export const useAdvisoryStore = defineStore('advisory', {
  state: () => ({
    advisories: [],
    newAdvisory: {
      event: {},
      selectedHour: {},
      studentAccount: ''
    },
    studentSelected: {},
    selectedHourQuote: 0,
    studentIsEnrolledAtThisHour: false,
    studentHasCheckInAtThisHour: false
  }),
  actions: {
    async getAllByAdvisor(advisorId) {
      useLoaderStore().loading = true;

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisors/${advisorId}/advisories`);
        this.advisories = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
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
    async getIfStudentHasCheckInAtThisHour(scheduleEventId, selectedDate, selectedTimeStart, studentAccount) {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisories/${scheduleEventId}/${selectedDate}/${selectedTimeStart}/checkin/${studentAccount}`);
        this.studentHasCheckInAtThisHour = data.id ? true : false;
      } catch (error) {
        console.log(error);
      }
    },
    async checkInStudent() {
      useLoaderStore().loading = true;

      try {
        await axios.post(`http://localhost:8000/api/v1/advisories/checkin`, this.newAdvisory);
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
