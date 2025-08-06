<script setup>
import { ref, onMounted, shallowRef, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import { storeToRefs } from 'pinia';
import BaseSelect from '../atoms/BaseSelect.vue';
import BaseInput from '../atoms/BaseInput.vue';
import BaseButton from '../atoms/BaseButton.vue';
import { useApi } from '../../composables/useApi.js';

const authStore = useAuthStore(); 
const { isAdmin } = storeToRefs(authStore);
const router = useRouter();
const route = useRoute();
const { post, get } = useApi();

const selectedMovieId = ref('');
const selectedCinemaId = ref('');
const startTimeDate = ref(''); 
const startTimeTime = ref(''); 

const movies = shallowRef([]);
const cinemas = shallowRef([]);
const errorMessage = ref('');
const successMessage = ref('');

const isFormValid = computed(() => {
  return selectedMovieId.value && selectedCinemaId.value && startTimeDate.value && startTimeTime.value;
});


const fetchMovies = async () => {
  try {
    movies.value = await get('/api/Movies'); 
  } catch (error) {
    console.error('Error fetching movies:', error);
    errorMessage.value = 'Dështoi ngarkimi i filmave.'; 
  }
};

const fetchCinemas = async () => {
  try {
    cinemas.value = await get('/api/Cinemas'); 
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
    router.push({ name: 'LoginPage', query: { redirect: route.fullPath } });
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';

  if (!isFormValid.value) {
    errorMessage.value = 'Ju lutemi plotësoni të gjitha fushat.'; 
    return;
  }

  const combinedStartTime = `${startTimeDate.value}T${startTimeTime.value}:00`; 

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push({ name: 'LoginPage', query: { redirect: route.fullPath } });
      return;
    }

    await post('/api/Showtimes', { 
        movieId: parseInt(selectedMovieId.value),
        cinemaId: parseInt(selectedCinemaId.value),
        startTime: combinedStartTime 
    },
    { headers: { 'Authorization': `Bearer ${token}` } });

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
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Ndodhi një gabim i papritur i rrjetit.';
  }
};
</script>

<template>
  <form @submit.prevent="handleAddShowtime" aria-label="Forma per shtimin e shfaqjes"> <BaseSelect
      id="movie"
      v-model="selectedMovieId"
      label="Filmi"
      placeholder="Zgjidh një film"
      :options="movies"
      value-key="id"
      label-key="title"
      required
    />
    <BaseSelect
      id="cinema"
      v-model="selectedCinemaId"
      label="Kinema"
      placeholder="Zgjidh një kinema"
      :options="cinemas"
      value-key="id"
      label-key="name"
      required
    />
    <BaseInput type="date"
      id="date"
      v-model="startTimeDate"
      label="Data e Shfaqjes" required />

    <BaseInput type="time"
      id="time" 
      v-model="startTimeTime" 
      label="Ora e Shfaqjes" required />
    
    <BaseButton
      type="submit"
      :disabled="!isAdmin || !isFormValid"
      :class="{
        'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
        'bg-red-600 hover:bg-red-700 text-white': isAdmin,
        'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin
      }"
      aria-label="Shto Shfaqje"> SHTO SHFAQJE
    </BaseButton>

    <p v-if="successMessage" class="text-green-400 mt-4" aria-live="polite">{{ successMessage }}</p> <p v-if="errorMessage" class="text-red-400 mt-4" aria-live="polite">{{ errorMessage }}</p> </form>
</template>