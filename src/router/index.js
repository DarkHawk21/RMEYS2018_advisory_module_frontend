import axios from 'axios';
import { _TOKEN } from '../config';
import GuardLoggedIn from '../guard/loggedIn';
import { createRouter, createWebHistory } from 'vue-router';
import LayoutView from '../views/LayoutView.vue';
import LoginView from '../views/LoginView.vue';
import StudentHomeView from '../views/student/StudentHomeView.vue';
import AdviserHomeView from '../views/adviser/AdviserHomeView.vue';
import AdminHomeView from '../views/admin/AdminHomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Hero',
    component: LayoutView,
    children: [
      {
        path: '',
        name: 'student-home',
        component: StudentHomeView,
        meta: {
          rolesCanEnter: [
            'student'
          ]
        }
      },
      {
        path: '/adviser',
        name: 'adviser-home',
        component: AdviserHomeView,
        meta: {
          rolesCanEnter: [
            'advisor'
          ]
        }
      },
      {
        path: '/admin',
        name: 'admin-home',
        component: AdminHomeView,
        meta: {
          rolesCanEnter: [
            'admin'
          ]
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(GuardLoggedIn);

let token = null;

if (token = localStorage.getItem(_TOKEN)) {
  axios.defaults.headers.common.Authorization = `Bearer ${ token }`;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem(_TOKEN);
        router.replace('/login');
      } else {
        return Promise.reject(error);
      }
    }
  );
}

export default router;
