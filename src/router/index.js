import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue'; 
import Cinema from '../components/Cinema.vue';
import Booking from '../components/Booking.vue';
import MyAccount from '../components/MyAccount.vue';
import LoginPage from '../components/pages/LoginPage.vue';
import RegisterPage from '../components/pages/RegisterPage.vue';
import AddCinemaPage from '../components/pages/AddCinemaPage.vue';
import AddShowtimePage from '../components/pages/AddShowtimePage.vue';
import EditShowtimePage from '../components/pages/EditShowtimePage.vue';
import MoviePage from '../components/pages/MoviePage.vue';
import AddMoviesPage from '../components/pages/AddMoviesPage.vue';
import CinemaPage from '../components/pages/CinemaPage.vue';
import EditCInemaPage from '../components/pages/EditCInemaPage.vue';
import BookingPage from '../components/pages/BookingPage.vue';
import MyAccountPage from '../components/pages/MyAccountPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MoviePage,
  },
  {
    path: '/login', 
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/kinemat',
    name: 'Cinema',
    component: CinemaPage,
  },
  {
    path: '/add-movie',
    name: 'AddMovies',
    component: AddMoviesPage
  },
  {
    path: '/add-showtime',
    name: 'AddShowtimePage',
    component: AddShowtimePage
  },
  {
    path: '/booking/:showtimeId',
    name: 'Booking',
    component: BookingPage,
    props: true,
    meta: {requiresAuth: true}
  },
  {
    path: '/myaccount',
    name: 'MyAccount',
    component: MyAccountPage
  },
  {
    path: '/add-cinemas',
    name: 'AddCinemaPage',
    component: AddCinemaPage
  },
  {
    path: '/edit-cinema/:id',
    name: 'EditCinemaPage',
    component: EditCInemaPage
  },
  {
    path: '/edit-showtime/:id',
    name: 'EditShowtimePage',
    component: EditShowtimePage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;