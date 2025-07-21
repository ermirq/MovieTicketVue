import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue'; 
import Login from '../components/Login.vue'; 
import Register from '../components/Register.vue';
import Cinema from '../components/Cinema.vue';
import AddMovies from '../components/AddMovies.vue';
import AddShowtime from '../components/AddShowtime.vue';
import Booking from '../components/Booking.vue';
import MyAccount from '../components/MyAccount.vue';
import AddCinema from '../components/AddCinema.vue';
import EditCinema from '../components/EditCinema.vue';
import EditShowtime from '../components/EditShowtime.vue';
import LoginForm from '../components/organisms/LoginForm.vue';
import LoginPage from '../components/pages/LoginPage.vue';
import RegisterPage from '../components/pages/RegisterPage.vue';
import AddCinemaPage from '../components/pages/AddCinemaPage.vue';
import AddMoviesPage from '../components/pages/AddMoviesPage.vue';
import AddShowtimePage from '../components/pages/AddShowtimePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
    component: Cinema,
  },
  {
    path: '/add-movie',
    name: 'AddMoviesPage',
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
    component: Booking,
    props: true,
    meta: {requiresAuth: true}
  },
  {
    path: '/myaccount',
    name: 'MyAccount',
    component: MyAccount
  },
  {
    path: '/add-cinemas',
    name: 'AddCinemaPage',
    component: AddCinemaPage
  },
  {
    path: '/edit-cinema/:id',
    name: 'EditCinema',
    component: EditCinema
  },
  {
    path: '/edit-showtime/:id',
    name: 'EditShowtime',
    component: EditShowtime
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;