import 'moment/dist/locale/es-mx';
import './assets/styles/main.scss';
import '@vuepic/vue-datepicker/dist/main.css';

import moment from 'moment';
import VueDatePicker from '@vuepic/vue-datepicker';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

moment.locale('es-mx');

const app = createApp(App);

app.component('VueDatePicker', VueDatePicker);

app.provide("moment", moment);

app.use(createPinia());
app.use(VueSweetalert2);
app.use(router);

app.mount('#app');
