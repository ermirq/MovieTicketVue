<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js';
import axios from 'axios';

const { isAdmin } = useAuthStore();
const route = useRoute();
const router = useRouter();

const cinemaId = ref(null);
const name = ref('');
const location = ref('');
const numRows = ref(null);      
const seatsPerRow = ref(null);  

const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const API_BASE_URL = 'https://localhost:7127';

const fetchCinema = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const id = route.params.id;
    if (!id) {
      errorMessage.value = 'ID e kinemasë mungon në URL.';
      loading.value = false;
      return;
    }
    cinemaId.value = id;

    const token = localStorage.getItem('userToken');
    if (!token) {
      errorMessage.value = 'Token autentifikimi mungon. Ju lutemi kyçuni.';
      router.push('/login');
      loading.value = false;
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/api/Cinemas/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data
    name.value = data.name;
    location.value = data.location;
    numRows.value = data.numRows;        
    seatsPerRow.value = data.seatsPerRow; 

  } catch (error) {
    console.error('Gabim gjatë ngarkimit të kinemasë:', error);
    errorMessage.value = error.message || 'Ndodhi një gabim gjatë ngarkimit të kinemasë.';
  } finally {
    loading.value = false;
  }
};

const handleUpdateCinema = async () => {
  if (!isAdmin.value) {
    errorMessage.value = 'Ju nuk jeni i autorizuar të përditësoni kinema.';
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';

  if (!name.value || !location.value) {
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

    const response = await axios.put(`${API_BASE_URL}/api/Cinemas/${cinemaId.value}`, {
        name: name.value,
        location: location.value
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    successMessage.value = 'Kinemaja u përditësua me sukses!';
    
    setTimeout(() => {
      router.push(`/kinemat`);
    }, 500);

  } catch (error) {
  console.error('Gabim gjatë përditësimit të kinemasë:', error);

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
  }
};

onMounted(() => {
  if (!isAdmin.value) {
    router.push('/');
    errorMessage.value = 'Nuk keni akses në këtë faqe. Kërkohen të drejta administratori.';
    loading.value = false;
    return;
  }
  fetchCinema();
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-8 px-4 bg-gray-900 text-gray-100">
    <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md w-full mt-20 z-20">
      <h2 class="text-3xl font-bold text-white mb-6">PËRDITËSO KINEMANË</h2>

      <div v-if="loading" class="text-white">Duke ngarkuar të dhënat e kinemasë...</div>
      <div v-else-if="errorMessage && !isAdmin" class="text-red-400 mt-4">{{ errorMessage }}</div>
      <div v-else-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</div>
      <div v-else-if="!isAdmin" class="text-yellow-400 mt-4">Ju nuk jeni i autorizuar të përditësoni kinema.</div>

      <form v-else @submit.prevent="handleUpdateCinema">
        <div class="mb-4">
          <label for="name" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Emri i Kinemasë</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="Emri i Kinemasë"
            required
          />
        </div>

        <div class="mb-4">
          <label for="location" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Lokacioni</label>
          <input
            type="text"
            id="location"
            v-model="location"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="Lokacioni i Kinemasë"
            required
          />
        </div>
        
        <button
          type="submit"
          :disabled="!isAdmin || loading"
          :class="{
            'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
            'bg-blue-600 hover:bg-blue-700 text-white': isAdmin && !loading,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin || loading
          }"
        >
          PËRDITËSO KINEMANË
        </button>

        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>