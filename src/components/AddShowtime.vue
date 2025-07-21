<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js';
import axios from 'axios';

const { isAdmin } = useAuthStore();
const router = useRouter();

const selectedMovieId = ref('');
const selectedCinemaId = ref('');
const startTimeDate = ref(''); 
const startTimeTime = ref(''); 

const movies = ref([]);
const cinemas = ref([]);

const errorMessage = ref('');
const successMessage = ref('');

const API_BASE_URL = 'https://localhost:7127'; 

const fetchMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Movies`); 
    movies.value = response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    errorMessage.value = 'Dështoi ngarkimi i filmave.'; 
  }
};

const fetchCinemas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Cinemas`); 
    cinemas.value = response.data;
  } catch (error) {
    console.error('Error fetching cinemas:', error);
    errorMessage.value = 'Dështoi ngarkimi i kinemave.'; 
  }
};

onMounted(() => {
  fetchMovies();
  fetchCinemas();
});

const handleAddShowtime = async () => {
  if (!isAdmin.value) {
    errorMessage.value = 'Ju nuk jeni i autorizuar të shtoni shfaqje.'; 
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';

  if (!selectedMovieId.value || !selectedCinemaId.value || !startTimeDate.value || !startTimeTime.value) {
    errorMessage.value = 'Ju lutemi plotësoni të gjitha fushat.'; 
    return;
  }

  const combinedStartTime = `${startTimeDate.value}T${startTimeTime.value}:00`; 

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      errorMessage.value = 'Token per autentifikim mungon. Ju lutemi kyçuni.'; 
      router.push('/login');
      return;
    }

    const response = await axios.post(`${API_BASE_URL}/api/Showtimes`, { 
        movieId: parseInt(selectedMovieId.value),
        cinemaId: parseInt(selectedCinemaId.value),
        startTime: combinedStartTime 
    },
    {
        headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(response);

    successMessage.value = 'Shfaqja u shtua me sukses!'; 
    selectedMovieId.value = '';
    selectedCinemaId.value = '';
    startTimeDate.value = '';
    startTimeTime.value = '';

    setTimeout(() => {
      router.push('/kinemat'); 
    }, 500);

  } catch (error) {
    console.error('Gabim gjatë shtimit të shfaqjes:', error); 
    errorMessage.value = error.message || 'Ndodhi një gabim i papritur i rrjetit.'; 
  }

  if (error.response) {
    const errData = error.response.data;

    errorMessage.value =
      errData.message ||
      (errData.errors ? Object.values(errData.errors).flat().join(' ') : null) ||
      errData.detail || 'Ndodhi një gabim gjatë shtimit te shfaqjes.';
    
    if (error.response.status === 401 || error.response.status === 403) {
      errorMessage.value = 'Ju nuk jeni i autorizuar të kryeni këtë veprim.';
    }

    } else {
      errorMessage.value = error.message || 'Ndodhi një gabim i papritur i rrjetit.';
    }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-8 px-4 bg-gray-900 text-gray-100">
    <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md w-full mt-20 z-20">
      <h2 class="text-3xl font-bold text-white mb-6">SHTO SHFAQJE TË RE</h2>

      <form @submit.prevent="handleAddShowtime">
        <div class="mb-4">
          <label for="movie" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Filmi</label>
          <select id="movie" v-model="selectedMovieId"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white outline-none appearance-none"
            required>
            <option value="" disabled>Zgjidh një film</option>
            <option v-for="movie in movies" :key="movie.id" :value="movie.id">
              {{ movie.title }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="cinema" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Kinema</label>
          <select id="cinema" v-model="selectedCinemaId"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white outline-none appearance-none"
            required>
            <option value="" disabled>Zgjidh një kinema</option>
            <option v-for="cinema in cinemas" :key="cinema.id" :value="cinema.id">
              {{ cinema.name }} ({{ cinema.location }})
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="date" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Data e Shfaqjes</label>
          <input type="date" id="date" v-model="startTimeDate"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white outline-none"
            required/>
        </div>

        <div class="mb-6">
          <label for="time" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Ora e Shfaqjes</label>
          <input type="time" id="time" v-model="startTimeTime"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white outline-none"
            required/>
        </div>

        <button
          type="submit"
          :disabled="!isAdmin"
          :class="{'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
            'bg-red-600 hover:bg-red-700 text-white': isAdmin,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin}">
          SHTO SHFAQJE
        </button>

        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
        <p v-if="!isAdmin" class="text-yellow-400 mt-4">Ju nuk jeni i autorizuar të shtoni shfaqje.</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%23d1d5db' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5em 1.5em;
}
</style>