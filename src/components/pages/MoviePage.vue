<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../assets/authVerification/useAuth';
import axios from 'axios';
import ErrorMessage from '../atoms/ErrorMessage.vue';
import LoadingSpinner from '../atoms/LoadingSpinner.vue';
import FiltersBar from '../organisms/FiltersBar.vue';
import MovieGrid from '../organisms/MovieGrid.vue';
import { storeToRefs } from 'pinia';
import { formatDateForValue } from '../../assets/utils/dateUtils';

const movies = ref([]);
const searchQuery = ref('');
const nextSevenDays = ref([]);
const loading = ref(true);
const error = ref(null);

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);
const API_BASE_URL = 'https://localhost:7127';

const daysOfWeek = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];
const countries = [
  { name: 'Kosovo', value: 'kosovo' },
  { name: 'Albania', value: 'albania' }
];

const generateNextSevenDays = () => {
  const today = new Date();
  nextSevenDays.value = [{ text: 'Sot', value: formatDateForValue(today) }];
  for (let i = 1; i <= 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    nextSevenDays.value.push({
      text: `${daysOfWeek[date.getDay()]} ${formatDateForValue(date)}`,
      value: formatDateForValue(date),
    });
  }
};

const fetchShowtimesByMovie = async (movieId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Showtimes/byMovie/${movieId}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const fetchMoviesWithShowtimes = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Movies`);
    const moviesData = response.data;
    for (const movie of moviesData) {
      movie.showtimes = await fetchShowtimesByMovie(movie.id);
    }
    movies.value = moviesData;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const searchMovies = async () => {
  if (!searchQuery.value.trim()) {
    fetchMoviesWithShowtimes();
  } else {
  loading.value = true;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Movies/search?name=${encodeURIComponent(searchQuery.value)}`);
    movies.value = response.data;
  } finally {
    loading.value = false;
  }
};

const handleDeleteMovie = async (movieId, movieName) => {
  console.log('Delete event received:', movieId, movieName);
  if (!isAdmin.value) {
    alert('Ju nuk jeni i autorizuar të fshini filmin.');
    return;
  }
  if (!confirm(`Jeni të sigurt që dëshironi të fshini filmin "${movieName}"? Kjo do të fshijë gjithashtu të gjitha shfaqjet e lidhura me të!`)) return;
  try {
    const token = localStorage.getItem('userToken');
    await axios.delete(`${API_BASE_URL}/api/Movies/${movieId}`, { headers: { Authorization: `Bearer ${token}` } });
    movies.value = movies.value.filter((m) => m.id !== movieId);
  } catch (err) {
    error.value = err.message || 'Ndodhi një gabim i papritur.';
  }
};

onMounted(() => {
  generateNextSevenDays();
  fetchMoviesWithShowtimes();
});
</script>

<template>
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
    <div class="text-center container mx-auto ">
      <FiltersBar v-model:search="searchQuery" :countries="countries" :dates="nextSevenDays" @search="searchMovies" />

      <LoadingSpinner v-if="loading" message="Duke ngarkuar filmat..." />
      <ErrorMessage v-if="error" :message="error.message" />

      <MovieGrid
        :movies="movies"
        :isAdmin="isAdmin"
        @delete="handleDeleteMovie"/>  
    </div>
  </div>
</template>
