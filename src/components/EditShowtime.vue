<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js';
import axios from 'axios';

const { isAdmin } = useAuthStore();
const route = useRoute();
const router = useRouter();

const showtimeId = ref(null);
const selectedMovieId = ref(null);
const selectedCinemaId = ref(null);

const selectedDate = ref(''); 
const selectedTime = ref(''); 

const movies = ref([]);
const cinemas = ref([]);

const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const API_BASE_URL = 'https://localhost:7127';

const fetchDropdownData = async () => {
    try {
        const moviesResponse = await axios.get(`${API_BASE_URL}/api/Movies`);
        const cinemasResponse = await axios.get(`${API_BASE_URL}/api/Cinemas`);

        movies.value = moviesResponse.data;
        cinemas.value = cinemasResponse.data;
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
        errorMessage.value = 'Dështoi ngarkimi i të dhënave për filmat dhe kinematë.';
    }
};

const fetchShowtime = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const id = route.params.id;
    if (!id) {
      errorMessage.value = 'ID e shfaqjes mungon në URL.';
      loading.value = false;
      return;
    }
    showtimeId.value = id;

    const token = localStorage.getItem('userToken');
    if (!token) {
      errorMessage.value = 'Token autentifikimi mungon. Ju lutemi kyçuni.';
      router.push('/login');
      loading.value = false;
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/api/Showtimes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data;
    selectedMovieId.value = data.movieId;
    selectedCinemaId.value = data.cinemaId;

    const dateTime = new Date(data.startTime);
    selectedDate.value = dateTime.toISOString().slice(0, 10); 
    selectedTime.value = dateTime.toTimeString().slice(0, 5); 
  } catch (error) {
    console.error('Gabim gjatë ngarkimit të shfaqjes:', error);
    errorMessage.value = error.message || 'Ndodhi një gabim gjatë ngarkimit të shfaqjes.';
  } finally {
    loading.value = false;
  }
};

const handleUpdateShowtime = async () => {
  if (!isAdmin.value) {
    errorMessage.value = 'Ju nuk jeni i autorizuar të përditësoni shfaqje.';
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';

  if (!selectedMovieId.value || !selectedCinemaId.value || !selectedDate.value || !selectedTime.value) {
    errorMessage.value = 'Ju lutemi plotësoni të gjitha fushat.';
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
        errorMessage.value = 'Token autentifikimi mungon. Ju lutemi kyçuni.';
        router.push('/login');
        return;
    }

    const combinedStartTime = `${selectedDate.value}T${selectedTime.value}:00`; 

    const response = await axios.put(`${API_BASE_URL}/api/Showtimes/${showtimeId.value}`, {
        movieId: selectedMovieId.value,
        cinemaId: selectedCinemaId.value,
        startTime: combinedStartTime 
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data;

    successMessage.value = 'Shfaqja u përditësua me sukses!';
    
    setTimeout(() => {
      router.push(`/kinemat`); 
    }, 300);

  } catch (error) {
    console.error('Gabim gjatë përditësimit të shfaqjes:', error);
    errorMessage.value = error.message || 'Ndodhi një gabim i papritur i rrjetit.';
  }

  if (error.response) {
    const errData = error.response.data;

    errorMessage.value =
      errData.message ||
      (errData.errors ? Object.values(errData.errors).flat().join(' ') : null) ||
      errData.detail || 'Ndodhi një gabim gjatë përditësimit.';
    
    if (error.response.status === 401 || error.response.status === 403) {
      errorMessage.value = 'Ju nuk jeni i autorizuar të kryeni këtë veprim.';
    }

    } else {
      errorMessage.value = error.message || 'Ndodhi një gabim i papritur i rrjetit.';
    }
};

onMounted(async () => {
  if (!isAdmin.value) {
    router.push('/');
    errorMessage.value = 'Nuk keni akses në këtë faqe. Kërkohen të drejta administratori.';
    loading.value = false;
    return;
  }
  await fetchDropdownData();
  await fetchShowtime();
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-8 px-4 bg-gray-900 text-gray-100">
    <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md w-full mt-20 z-20">
      <h2 class="text-3xl font-bold text-white mb-6">PËRDITËSO SHFAQJE</h2>

      <div v-if="loading" class="text-white">Duke ngarkuar të dhënat e shfaqjes...</div>
      <div v-else-if="errorMessage && !isAdmin" class="text-red-400 mt-4">{{ errorMessage }}</div>
      <div v-else-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</div>
      <div v-else-if="!isAdmin" class="text-yellow-400 mt-4">Ju nuk jeni i autorizuar të përditësoni shfaqje.</div>

      <form v-else @submit.prevent="handleUpdateShowtime">
        <div class="mb-4">
          <label for="movie" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Filmi</label>
          <select id="movie" v-model="selectedMovieId"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            required>
            <option value="">Zgjidhni një film</option>
            <option v-for="movie in movies" :key="movie.id" :value="movie.id">{{ movie.title }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="cinema" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Kinema</label>
          <select id="cinema" v-model="selectedCinemaId"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            required>
            <option value="">Zgjidhni një kinema</option>
            <option v-for="cinema in cinemas" :key="cinema.id" :value="cinema.id">{{ cinema.name }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="date" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Data e Shfaqjes</label>
          <input type="date" id="date" v-model="selectedDate"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            required/>
        </div>

        <div class="mb-4">
          <label for="time" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Ora e Shfaqjes</label>
          <input type="time" id="time" v-model="selectedTime"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            required/>
        </div>

        <button
          type="submit"
          :disabled="!isAdmin || loading"
          :class="{
            'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
            'bg-blue-600 hover:bg-blue-700 text-white': isAdmin && !loading,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin || loading}">
          PËRDITËSO SHFAQJE
        </button>

        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>