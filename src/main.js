import './assets/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
// import moment from 'moment';

// import VueDatePicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css';

const app = createApp(App);

// app.component('VueDatePicker', VueDatePicker);

// app.config.globalProperties.$moment = moment;

// app.config.globalProperties.$filters = {
//     time(date) {
//         return moment(date);
//     },
// }

app.use(createPinia());
app.use(router);

app.mount('#app');
