<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useAuthStore, useAuth } from '../assets/authVerification/useAuth';

const nextSevenDays = ref([]);
const movies = ref([]); 
const searchQuery = ref('');
const loading = ref(true); 
const error = ref(null);
const { isAdmin } = useAuthStore();

const API_BASE_URL = 'https://localhost:7127'; 


const daysOfWeek = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];

const formatDateForValue = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const formatDateForText = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const generateNextSevenDays = () => {
  const today = new Date();

  nextSevenDays.value.push({
    text: 'Sot',
    value: formatDateForValue(today),
  });

  for (let i = 1; i <= 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    let dayName = daysOfWeek[date.getDay()];
    let formattedDate = formatDateForText(date);

    nextSevenDays.value.push({
      text: `${dayName} ${formattedDate}`,
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
    const moviesData = response.data

    for (const movie of moviesData) {
      movie.showtimes = await fetchShowtimesByMovie(movie.id);
    }

    movies.value = moviesData;
  } catch (err) {
    console.error("Failed to fetch movies or showtimes:", err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const searchMovies = async () => {
  if (!searchQuery.value.trim()) {
    return;
  }
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`${API_BASE_URL}/api/Movies/search?name=${encodeURIComponent(searchQuery.value)}`);
    const moviesData = response.data;
    movies.value = moviesData;
  } catch (err) {
    console.error("Failed to search movies:", err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const handleDeleteMovie = async (movieId, movieName) => {
  if (!isAdmin.value) {
    alert('Ju nuk jeni i autorizuar të fshini filmin.');
    return;
  }
  if (!confirm(`Jeni të sigurt që dëshironi të fshini filmin "${movieName}"? Kjo do të fshijë gjithashtu të gjitha shfaqjet e lidhura me të!`)) {
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await axios.delete(`${API_BASE_URL}/api/Movies/${movieId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    movies.value = movies.value.filter(m => m.id !== movieId);
    alert('Filmi u fshi me sukses!');

  } catch (err) {
    console.error('Gabim gjatë fshirjes së filmit:', err);
    error.value = err.message || 'Ndodhi një gabim i papritur gjatë fshirjes së filmit.';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};


onMounted(() => {
  generateNextSevenDays(); 
  fetchMoviesWithShowtimes();
  fetchShowtimesByMovie();
});
</script>


<template>
  <div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen font-sans">
    <div class="text-center container mx-auto px-4 py-8">
      <div class="w-full bg-white dark:bg-gray-900 z-40 px-4 py-2 shadow-sm">
        <div class="flex justify-end mt-5 gap-3 max-w-7xl mx-auto">
          <div class="flex items-center space-x-2">
            <button @click="searchMovies" class="hover:text-red-500">
              <i class="fas fa-search"></i>
            </button>
            <input v-model="searchQuery" @keyup.enter="searchMovies" type="text" placeholder="Kërko film..." class="p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white" />
          </div>

          <select class="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none">
            <option value="">Të gjitha shtetet</option>
            <option value="kosovo">Kosovo</option>
            <option value="albania">Albania</option>
          </select>

          <select class="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none text-center" >
            <option v-for="date in nextSevenDays" :key="date.value" :value="date.value">
              {{ date.text }}
            </option>
          </select>
        </div>
      </div>

      <div class="pt-24 px-4 max-w-7xl mx-auto">
        <div v-if="loading" class="text-center text-gray-400 text-lg">
          Duke ngarkuar filmat...
        </div>
        <div v-if="error" class="text-center text-red-500 text-lg">
          Gabim gjatë ngarkimit të filmave: {{ error.message }}
        </div>

        <div v-if="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          <div v-for="movie in movies" :key="movie.id || movie._id"
           class="group bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 flex flex-col w-full max-w-xs sm:max-w-none cursor-pointer relative">
            <img :src="movie.posterUrl ? movie.posterUrl : 'https://via.placeholder.com/250x370?text=No+Poster'" alt="MoviePoster" class="w-full h-auto object-cover"/>
            <div class="p-4 flex flex-col justify-end flex-grow">
              <h3 class="text-l font-bold mb-2 text-gray-900 dark:text-white uppercase">
                {{ movie.title }}
              </h3>
              <p class="text-sm text-gray-700 dark:text-gray-400">
                Filmi fillon:
                <span v-if="movie.showtimes && movie.showtimes.length > 0">
                  {{ formatDate(movie.showtimes[0].startTime) }}
                  <br />
                  Ora: {{ formatTime(movie.showtimes[0].startTime) }}
                </span>
                <span v-else>N/A</span>
              </p>
            </div>

            <div
              class="absolute bottom-0 left-0 right-0 bg-white text-black p-4
              transform translate-y-full group-hover:translate-y-0
              transition-transform duration-300 ease-in
              flex flex-col justify-center items-center text-sm">
              <p class="text-center mb-2">
                {{ movie.description || 'No description available.' }}
              </p>
              <p class="text-center mb-1">
                <strong>Kategoria:</strong> {{ movie.genre || 'N/A' }}
              </p>
              <p class="text-center">
                <strong>Kohëzgjatja:</strong> {{ movie.durationInMinutes ? movie.durationInMinutes + ' min' : 'N/A' }}
              </p>
              <div v-if="isAdmin" class="flex space-x-2 justify-center items-center mt-2">
                <button
                  @click="handleDeleteMovie(movie.id, movie?.title)"
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 text-sm rounded-md transition-colors duration-200 flex items-center justify-center">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
