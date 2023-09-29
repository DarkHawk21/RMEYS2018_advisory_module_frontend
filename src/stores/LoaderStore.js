import { defineStore } from "pinia";

export const useLoaderStore = defineStore('loader', {
  state: () => ({
    loading: false
  })
});
