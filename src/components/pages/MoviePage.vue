<script setup>
import { ref, onMounted, shallowRef, watch } from 'vue';
import { useAuthStore } from '../../assets/authVerification/useAuth';
import ErrorMessage from '../atoms/ErrorMessage.vue';
import LoadingSpinner from '../atoms/LoadingSpinner.vue';
import FiltersBar from '../organisms/FiltersBar.vue';
import MovieGrid from '../organisms/MovieGrid.vue';
import { storeToRefs } from 'pinia';
import { formatDateForValue } from '../../assets/utils/dateUtils';
import { debounce } from 'lodash-es';
import { useFetch } from '../../composables/useFetch'; 
import { useApi } from '../../composables/useApi';

const movies = shallowRef([]);
const searchQuery = ref('');
const nextSevenDays = shallowRef([]);
const loading = ref(true);
const error = ref(null);

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);
const { del } = useApi(); 

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

const fetchMoviesWithShowtimes = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { result: moviesData, error: fetchError } = useFetch('/api/Movies', { cacheTime: 60000 });
    watch(moviesData, async (newMovies) => {
      if (!newMovies) return;
      for (const movie of newMovies) {
        const { result: showtimes } = useFetch(`/api/Showtimes/byMovie/${movie.id}`, { cacheTime: 30000 });
        watch(showtimes, (data) => { movie.showtimes = data || []; });
      }
      movies.value = newMovies;
    });
    if (fetchError.value) throw fetchError.value;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const searchMovies = async () => {
  if (!searchQuery.value.trim()) {
    fetchMoviesWithShowtimes();
    return;
  }
  loading.value = true;
  try {
    const { result: searchResults, error: fetchError } = useFetch(`/api/Movies/search?name=${encodeURIComponent(searchQuery.value)}`, { cacheTime: 30000 });
    watch(searchResults, (data) => { movies.value = data || []; });
    if (fetchError.value) throw fetchError.value;
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = debounce(() => {
  searchMovies();
}, 300);

watch(searchQuery, debouncedSearch);

const handleDeleteMovie = async (movieId, movieName) => {
  if (!isAdmin.value) {
    alert('Ju nuk jeni i autorizuar të fshini filmin.');
    return;
  }
  if (!confirm(`Jeni të sigurt që dëshironi të fshini filmin "${movieName}"? Kjo do të fshijë gjithashtu të gjitha shfaqjet e lidhura me të!`)) return;
  try {
    const token = localStorage.getItem('userToken');
    await del(`/api/Movies/${movieId}`, { headers: { Authorization: `Bearer ${token}` } });
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
    <div class="text-center container mx-auto" aria-label="Përmbajtja e faqes kryesore"> <FiltersBar v-model:search="searchQuery" :countries="countries" :dates="nextSevenDays" @search="searchMovies" />

      <LoadingSpinner v-if="loading" message="Duke ngarkuar filmat..." />
      <ErrorMessage v-if="error" :message="error.message" />

      <MovieGrid
        :movies="movies"
        :isAdmin="isAdmin"
        @delete="handleDeleteMovie"/>  
    </div>
  </div>
</template>