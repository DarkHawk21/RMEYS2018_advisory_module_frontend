import 'moment/dist/locale/es';
import './assets/styles/main.scss';
import '@vuepic/vue-datepicker/dist/main.css';

import moment from 'moment';
import VueDatePicker from '@vuepic/vue-datepicker';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

moment.locale('es');

const app = createApp(App);

app.component('VueDatePicker', VueDatePicker);

app.provide("moment", moment);

app.use(createPinia());
app.use(router);

app.mount('#app');
