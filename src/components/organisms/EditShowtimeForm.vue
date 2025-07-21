<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import BaseSelect from '../atoms/BaseSelect.vue';
import BaseButton from '../atoms/BaseButton.vue';
import BaseInput from '../atoms/BaseInput.vue';

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);
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
      <div v-if="loading" class="text-white">Duke ngarkuar të dhënat e shfaqjes...</div>
      <div v-else-if="errorMessage && !isAdmin" class="text-red-400 mt-4">{{ errorMessage }}</div>
      <div v-else-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</div>
      <div v-else-if="!isAdmin" class="text-yellow-400 mt-4">Ju nuk jeni i autorizuar të përditësoni shfaqje.</div>

      <form v-else @submit.prevent="handleUpdateShowtime">
        <BaseSelect type="text"
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
            'bg-blue-600 hover:bg-blue-700 text-white': isAdmin,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin}">
            PËRDITËSO SHFAQJE
        </BaseButton>

        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
      </form>
</template>