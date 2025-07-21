<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js';
import axios from 'axios';

const { isAdmin } = useAuthStore();
const router = useRouter();

const name = ref('');
const location = ref('');
const numRows = ref(null); 
const seatsPerRow = ref(null); 

const errorMessage = ref('');
const successMessage = ref('');

const API_BASE_URL = 'https://localhost:7127';

const handleAddCinema = async () => {
  if (!isAdmin.value) {
    errorMessage.value = 'Ju nuk jeni i autorizuar të shtoni kinema.';
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';

  if (!name.value || !location.value || numRows.value === null || seatsPerRow.value === null) {
    errorMessage.value = 'Ju lutemi plotësoni të gjitha fushat.';
    return;
  }

  if (numRows.value <= 0 || seatsPerRow.value <= 0 || !Number.isInteger(numRows.value) || !Number.isInteger(seatsPerRow.value)) {
    errorMessage.value = 'Numri i rreshtave dhe vendet për rresht duhet të jenë numra të plotë pozitivë.'; 
    return;
  }
  if (numRows.value > 26) {
      errorMessage.value = 'Numri i rreshtave nuk mund të kalojë 26 (për shkronjat A-Z).'; 
      return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
        errorMessage.value = 'Token autentifikimi mungon. Ju lutemi kyçuni.';
        router.push('/login');
        return;
    }

    const response = await axios.post(`${API_BASE_URL}/api/Cinemas`, {
        name: name.value,
        location: location.value,
        numRows: numRows.value,
        seatsPerRow: seatsPerRow.value
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    successMessage.value = 'Kinemaja u shtua me sukses!';
    
    name.value = '';
    location.value = '';
    numRows.value = null;
    seatsPerRow.value = null;

    setTimeout(() => {
      router.push('/kinemat');
    }, 500);

  } catch (error) {
    console.error('Gabim gjatë shtimit të kinemasë:', error);
    errorMessage.value = error.message || 'Ndodhi një gabim i papritur i rrjetit.';
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-8 px-4 bg-gray-900 text-gray-100">
    <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md w-full mt-20 z-20">
      <h2 class="text-3xl font-bold text-white mb-6">SHTO KINEMA TË RE</h2>

      <form @submit.prevent="handleAddCinema">
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

        <div class="mb-4">
          <label for="numRows" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Numri i rreshtave</label>
          <input
            type="number"
            id="numRows"
            v-model.number="numRows" class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="Numri i rreshtave"
            min="1"
            max="26"
            required
          />
        </div>

        <div class="mb-6">
          <label for="seatsPerRow" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Vendet per rresht</label>
          <input type="number" id="seatsPerRow" v-model.number="seatsPerRow"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="Vendet per rresht" min="1" required/>
        </div>

        <button
          type="submit"
          :disabled="!isAdmin"
          :class="{
            'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
            'bg-red-600 hover:bg-red-700 text-white': isAdmin,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin}">
          SHTO KINEMA
        </button>

        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
        <p v-if="!isAdmin" class="text-yellow-400 mt-4">Ju nuk jeni i autorizuar të shtoni kinema.</p>
      </form>
    </div>
  </div>
</template>