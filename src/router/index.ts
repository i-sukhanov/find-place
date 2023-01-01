import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MapView from '../views/MapView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: MapView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: import('@/views/AdminView.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    component: import('@/views/AuthView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
