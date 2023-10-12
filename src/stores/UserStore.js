import axios from 'axios';
import { _TOKEN } from '../config';
import { defineStore } from 'pinia';
import { _API_URL } from '../config';
import { useLoaderStore } from './LoaderStore';
import Swal from 'sweetalert2/dist/sweetalert2';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    token: localStorage.getItem(_TOKEN) || null,
  }),
  actions: {
    async login(loginData) {
      useLoaderStore().loading = true;

      try {
        const { data } = await axios.post(`${_API_URL}/login`, loginData);
        localStorage.setItem(_TOKEN, data.access_token);
        this.token = data.access_token;
        axios.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
        axios.defaults.headers.common.Accept = 'application/json';
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;

        if (error.response.status == 401) {
          Swal.fire({
            toast: true,
            timer: 5000,
            icon: 'error',
            position: 'bottom-end',
            timerProgressBar: true,
            showConfirmButton: false,
            title: 'Error de login',
            text: 'Credenciales de acceso incorrectas.'
          });
        }
      }
    },
    async logout() {
      useLoaderStore().loading = true;

      try {
        const response = await axios.post(`${_API_URL}/logout`, this.token);
        localStorage.removeItem(_TOKEN);
        this.token = null;
        axios.defaults.headers.common.Authorization = '';
        useLoaderStore().loading = false;
      } catch (error) {
        useLoaderStore().loading = false;
      }
    }
  }
});
