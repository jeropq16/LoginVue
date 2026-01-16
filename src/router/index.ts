import { createRouter, createWebHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';

import DashboardView from '../views/DashboardView.vue';
import UserWelcomeView from '../views/UserWelcomeView.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/user-welcome', name: 'UserWelcome', component: UserWelcomeView }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('user_role');
  if (to.path === '/dashboard' && role !== 'Admin') {
    next('/user-welcome');
    return;
  }
  if (to.path === '/user-welcome' && role !== 'User') {
    next('/dashboard');
    return;
  }
  next();
});

export default router;
