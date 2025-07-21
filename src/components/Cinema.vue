<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js';
import axios from 'axios';
import { storeToRefs } from 'pinia';

const cinemas = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCountry = ref('');
const API_BASE_URL = 'https://localhost:7127';

const router = useRouter();
const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

const fetchCinemas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Cinemas`);
    const data = response.data;
    cinemas.value = data;
  } catch (err) {
    console.error('Failed to fetch cinemas:', err);

    if (err.response) {
      error.value =
        err.response.data.message ||
        err.response.data.detail ||
        'Gabim gjatë ngarkimit të kinemave.';
    } else {
      error.value = 'Gabim gjatë ngarkimit të kinemave: ' + err.message;
    }
  } finally {
    loading.value = false;
  }
};


const filteredCinemas = computed(() => {
  if (!selectedCountry.value) {
    return cinemas.value;
  }
  return cinemas.value.filter(cinema => cinema.location.toLowerCase().includes(selectedCountry.value.toLowerCase()));
});

const handleEditCinema = (cinemaId) => {
  router.push(`/edit-cinema/${cinemaId}`);
};

const handleEditShowtime = (showtimeId) => {
  router.push(`/edit-showtime/${showtimeId}`); 
};

const handleDeleteCinema = async (cinemaId, cinemaName) => {
  if (!isAdmin.value) {
    alert('Ju nuk jeni i autorizuar të fshini kinema.');
    return;
  }
  if (!confirm(`Jeni të sigurt që dëshironi të fshini kinemanë "${cinemaName}"? Kjo do të fshijë gjithashtu të gjitha vendet dhe shfaqjet e lidhura!`)) {
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await axios.delete(`${API_BASE_URL}/api/Cinemas/${cinemaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    cinemas.value = cinemas.value.filter(c => c.id !== cinemaId);
    alert('Kinemaja u fshi me sukses!');

  } catch (err) {
    console.error('Gabim gjatë fshirjes së kinemasë:', err);
    error.value = err.message || 'Ndodhi një gabim i papritur gjatë fshirjes së kinemasë.';
  }
};

const handleDeleteShowtime = async (showtimeId, movieTitle) => {
  if (!isAdmin.value) {
    alert('Ju nuk jeni i autorizuar të fshini shfaqje.'); 
    return;
  }
  if (!confirm(`Jeni të sigurt që dëshironi të fshini shfaqjen për filmin "${movieTitle}"? Kjo do të fshijë gjithashtu të gjitha rezervimet e lidhura!`)) { 
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await axios.delete(`${API_BASE_URL}/api/Showtimes/${showtimeId}`, { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    alert('Shfaqja u fshi me sukses!'); 

  } catch (err) {
    console.error('Gabim gjatë fshirjes së shfaqjes:', err);
    error.value = err.message || 'Ndodhi një gabim i papritur gjatë fshirjes së shfaqjes.'; 
  }
};


onMounted(() => {
  fetchCinemas();
});
</script>

<template>
  <div class="bg-gray-900 text-gray-100 min-h-screen pt-20">
    <div class="container mx-auto px-4 ">
      <div class="w-full bg-gray-900 z-40 px-4 py-2 shadow-xl mb-6">
        <div class="flex justify-between items-center gap-3 max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white text-center">Kinemat (Cinemas)</h1>
          <select v-model="selectedCountry"
                  class="p-2 h-10 rounded-md border border-gray-700 bg-gray-800 text-center text-gray-100 appearance-none">
            <option value="">Të gjitha shtetet</option>
            <option value="kosovo">Kosovo</option>
            <option value="albania">Albania</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-white text-center">
        Duke ngarkuar kinemat... (Loading cinemas...)
      </div>

      <div v-else-if="error" class="text-red-500 text-center p-4 border border-red-700 rounded-md">
        {{ error }}
      </div>

      <div v-else-if="filteredCinemas.length === 0" class="text-white text-center p-4">
        Nuk u gjetën kinema. (No cinemas found matching your criteria.)
      </div>

      <div v-else class="text-center grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mt-10">
        <div v-for="cinema in filteredCinemas" :key="cinema.id"
             class="bg-gray-800 bg-opacity-70 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">

          <div class="relative w-full mb-2">
            <h2 class="text-2xl font-bold text-white text-center">{{ cinema.name }}</h2>

            <div v-if="isAdmin" class="absolute right-0 top-1/2 -translate-y-1/2 flex space-x-2">
              <button
                @click="handleEditCinema(cinema.id)"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 text-sm rounded-md transition-colors duration-200 flex items-center"
              >
                <i class="fas fa-edit mr-1"></i> Përditëso
              </button>
              <button
                @click="handleDeleteCinema(cinema.id, cinema.name)"
                class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 text-sm rounded-md transition-colors duration-200 flex items-center"
              >
                <i class="fas fa-trash-alt mr-1"></i> Fshi
              </button>
            </div>
          </div>
          <p class="text-gray-300 mb-4">{{ cinema.location }}</p>
          <div v-if="cinema.showtimes && cinema.showtimes.length > 0">
            <h3 class="text-xl font-semibold text-red-500 mb-3">Filmat dhe Shfaqjet (Movies & Showtimes):</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-5 ">
              <div v-for="showtime in cinema.showtimes" :key="showtime.id"
                   class="bg-gray-700 bg-opacity-60 rounded-md flex flex-col items-center text-center p-2 w-full h-full">
                <img :src="showtime.movie?.posterUrl" alt="Movie Poster"
                  class="w-full h-[300px] object-cover rounded-md mb-3">
                <h4 class="text-lg font-semibold text-white">{{ showtime.movie?.title }}</h4>

                <router-link :to="`/booking/${showtime.id}`" custom v-slot="{ navigate }">
                  <button
                    @click="navigate"
                    class="mt-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Rezervo Biletën
                  </button>
                </router-link>

                 <div v-if="isAdmin" class="flex space-x-2 justify-center items-center mt-2">
                    <button
                      @click="handleEditShowtime(showtime.id)"
                      class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 text-sm rounded-md transition-colors duration-200 flex items-center justify-center">
                      <i class="fas fa-edit"></i> 
                    </button>
                    <button
                      @click="handleDeleteShowtime(showtime.id, showtime.movie?.title)"
                      class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 text-sm rounded-md transition-colors duration-200 flex items-center justify-center">
                      <i class="fas fa-trash-alt "></i> 
                    </button>
                  </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-400 mt-4 text-center">
            Nuk ka shfaqje të planifikuara për këtë kinema. (No showtimes scheduled for this cinema.)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>