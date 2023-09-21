import { defineStore } from 'pinia';
import advisers from './db/advisers.json';
import adviserAdvicesByDay from './db/adviserAdvicesByDay.json';

export const useAdviserStore = defineStore('adviser', {
  state: () => ({
    adviserSelected: {
      id: undefined,
      img: '',
      name: '',
      language: '',
    },
    advisers: [],
    adviserAdvicesByDay: [],
    filters: {
      adviser: null
    }
  }),
  actions: {
    getAdviser(adviserId) {
      this.adviserSelected = this.advisers.find(adviser => adviser.id == adviserId);
    },
    getAdvisers() {
      this.advisers = advisers;
    },
    getAllAdvicesByAdviserByDay() {
      this.adviserAdvicesByDay = adviserAdvicesByDay;
    },
    clearSelection() {
      this.adviserSelected = {
        id: undefined,
        img: '',
        name: '',
        language: '',
      };
    }
  }
});
