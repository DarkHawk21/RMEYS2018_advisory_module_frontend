import { createRouter, createWebHistory } from 'vue-router';
import LayoutView from '../views/LayoutView.vue';
import LoginView from '../views/LoginView.vue';
import StudentHomeView from '../views/student/StudentHomeView.vue';
import AdviserHomeView from '../views/adviser/AdviserHomeView.vue';
import AdminHomeView from '../views/admin/AdminHomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutView,
      children: [
        {
          path: '/',
          name: 'student-home',
          component: StudentHomeView
        }
      ]
    },
    {
      path: '/adviser',
      component: LayoutView,
      children: [
        {
          path: '/adviser',
          name: 'adviser-home',
          component: AdviserHomeView
        }
      ]
    },
    {
      path: '/admin',
      component: LayoutView,
      children: [
        {
          path: '/admin',
          name: 'admin-home',
          component: AdminHomeView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
});

export default router;
