import axios from 'axios';
import { _TOKEN } from '../config';
import { defineStore } from 'pinia';
import { useLoaderStore } from './LoaderStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    token: localStorage.getItem(_TOKEN) || null,
  }),
  actions: {
    async login(loginData) {
      useLoaderStore().loading = true;

      try {
        const { data } = await axios.post('http://localhost:8000/api/v1/login', loginData);
        localStorage.setItem(_TOKEN, data.access_token);
        this.token = data.access_token;
        axios.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
        axios.defaults.headers.common.Accept = 'application/json';
        useLoaderStore().loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async logout() {
      useLoaderStore().loading = true;

      try {
        const response = await axios.post('http://localhost:8000/api/v1/logout', this.token);
        localStorage.removeItem(_TOKEN);
        this.token = null;
        axios.defaults.headers.common.Authorization = '';
        useLoaderStore().loading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
});
