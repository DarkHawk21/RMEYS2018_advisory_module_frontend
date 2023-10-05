import axios from 'axios';
import { defineStore } from 'pinia';
import { useLoaderStore } from './LoaderStore';
import adviserAdvicesByDay from './db/adviserAdvicesByDay.json';

export const useAdviserStore = defineStore('adviser', {
  state: () => ({
    adviserSelected: {},
    advisers: [],
    adviserAdvicesByDay: [],
    filters: {
      adviser: null
    }
  }),
  actions: {
    async getAdviser(adviserId) {
      useLoaderStore().loading = true;

      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/advisors/${adviserId}`);
        this.adviserSelected = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    async getAdvisers() {
      useLoaderStore().loading = true;

      try {
        const { data } = await axios.get('http://localhost:8000/api/v1/advisors');
        this.advisers = data;
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    },
    getAllAdvicesByAdviserByDay() {
      this.adviserAdvicesByDay = adviserAdvicesByDay;
    },
    clearSelection() {
      this.adviserSelected = {};
    }
  }
});
