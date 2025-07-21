<script setup>
import { ref, onMounted, BaseTransitionPropsValidators } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import BaseSelect from '../atoms/BaseSelect.vue';
import BaseInput from '../atoms/BaseInput.vue';
import BaseButton from '../atoms/BaseButton.vue';

const authStore = useAuthStore(); 
const { isAdmin } = storeToRefs(authStore);
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
      <form @submit.prevent="handleAddShowtime">
        <BaseSelect
            id="movie"
            v-model="selectedMovieId"
            label="Filmi"
            placeholder="Zgjidh një film"
            :options="movies"
            value-key="id"
            label-key="title"
            required/>

        <BaseSelect
            id="cinema"
            v-model="selectedCinemaId"
            label="Kinema"
            placeholder="Zgjidh një kinema"
            :options="cinemas"
            value-key="id"
            label-key="name"
            required/>

        <BaseInput type="date"
            id="date"
            v-model="startTimeDate"
            label="Data e Shfaqjes"
            required />

        <BaseInput type="time"
            id="time"
            v-model="startTimeTime"
            label="Ora e Shfaqjes"
            required />

        <BaseButton
          type="submit"
          :disabled="!isAdmin"
          :class="{'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
            'bg-red-600 hover:bg-red-700 text-white': isAdmin,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin}">
          SHTO SHFAQJE
        </BaseButton>

        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
        <p v-if="!isAdmin" class="text-yellow-400 mt-4">Ju nuk jeni i autorizuar të shtoni shfaqje.</p>
      </form>
</template>