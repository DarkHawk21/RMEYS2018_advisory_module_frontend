import axios from 'axios';
import { _TOKEN } from '../config';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    token: localStorage.getItem(_TOKEN) || '',
  }),
  actions: {
    async login(loginData) {
      try {
        const { data } = await axios.post('http://localhost:8000/api/v1/login', loginData);
        localStorage.setItem(_TOKEN, data.access_token);
        this.token = data.access_token;
        axios.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
        axios.defaults.headers.common.Accept = 'application/json';
      } catch (error) {
        console.log(error);
      }
    }
  }
});
