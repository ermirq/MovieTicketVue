import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/pages/MoviePage.vue') 
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('../components/pages/LoginPage.vue') 
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: () => import('../components/pages/RegisterPage.vue')
  },
  {
    path: '/kinemat',
    name: 'Cinema',
    component: () => import('../components/pages/CinemaPage.vue') 
  },
  {
    path: '/add-movie',
    name: 'AddMovies',
    component: () => import('../components/pages/AddMoviesPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'Admin' }
  },
  {
    path: '/add-showtime',
    name: 'AddShowtimePage',
    component: () => import('../components/pages/AddShowtimePage.vue'),
    meta: { requiresAuth: true, requiresRole: 'Admin' }
  },
  {
    path: '/add-cinemas',
    name: 'AddCinemaPage',
    component: () => import('../components/pages/AddCinemaPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'Admin' }
  },
  {
    path: '/edit-cinema/:id',
    name: 'EditCinemaPage',
    component: () => import('../components/pages/EditCInemaPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'Admin' }
  },
  {
    path: '/edit-showtime/:id',
    name: 'EditShowtimePage',
    component: () => import('../components/pages/EditShowtimePage.vue'),
    meta: { requiresAuth: true, requiresRole: 'Admin' }
  },
  {
    path: '/booking/:showtimeId',
    name: 'Booking',
    component: () => import('../components/pages/BookingPage.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/myaccount',
    name: 'MyAccount',
    component: () => import('../components/pages/MyAccountPage.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'LoginPage', query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresRole && !authStore.userRoles.includes(to.meta.requiresRole)) {
    alert('Nuk keni qasje në këtë faqe.');
    return next({ name: 'Home' });
  }

  next();
});

export default router;