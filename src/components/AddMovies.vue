<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js';
import axios from 'axios';

const { isAdmin } = useAuthStore(); 

const router = useRouter();

const title = ref('');
const description = ref('');
const genre = ref('');
const durationInMinutes = ref(''); 
const posterUrl = ref(''); 
const errorMessage = ref('');
const successMessage = ref('');

const API_BASE_URL = 'https://localhost:7127';

const handleAddMovie = async () => {

  if (!isAdmin.value) {
    errorMessage.value = 'Ju nuk jeni i autorizuar të shtoni filma.'; 
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';

  
  if (!title.value || !description.value || !genre.value || !durationInMinutes.value || !posterUrl.value) {
    errorMessage.value = 'Ju lutemi plotësoni të gjitha fushat.'; 
    return;
  }
  if (isNaN(parseInt(durationInMinutes.value)) || parseInt(durationInMinutes.value) <= 0) {
    errorMessage.value = 'Kohëzgjatja duhet të jetë numër pozitiv.'; 
    return;
  }

  try {
    
    const token = localStorage.getItem('userToken');
    if (!token) {
        errorMessage.value = 'Token autentifikimi mungon. Ju lutemi kyçuni.'; 
        router.push('/login'); 
        return;
    }
    console.log(token)
    const response = await axios.post(`${API_BASE_URL}/api/Movies`, {
        title: title.value,
        description: description.value,
        genre: genre.value,
        durationInMinutes: parseInt(durationInMinutes.value),
        posterUrl: posterUrl.value
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data;
    console.log({
      title: title.value,
      description: description.value,
      genre: genre.value,
      durationInMinutes: parseInt(durationInMinutes.value),
      posterUrl: posterUrl.value
    });

    successMessage.value = 'Filmi u shtua me sukses!'; 
    title.value = '';
    description.value = '';
    genre.value = '';
    durationInMinutes.value = '';
    posterUrl.value = '';

    setTimeout(() => {
      router.push('/'); 
    }, 500);

  } catch (error) {
    console.error('Gabim gjatë shtimit të filmit:', error); 
    errorMessage.value = error.message || 'Ndodhi një gabim i papritur i rrjetit.'; 
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-8 px-4  bg-gray-900 text-gray-100"> 
    <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md w-full mt-15 z-20">
      <h2 class="text-3xl font-bold text-white mb-6">SHTO FILM TË RI</h2>

      <form @submit.prevent="handleAddMovie">
        <div class="mb-4">
          <label for="title" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Titulli</label>
          <input type="text" id="title" v-model="title"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="Titulli i filmit" required/>
        </div>

        <div class="mb-4">
          <label for="description" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Përshkrimi</label>
          <textarea id="description" v-model="description" rows="4"
            class="w-full px-4 py-2 rounded-lg bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="Përshkrimi i filmit" required>
          </textarea>
        </div>

        <div class="mb-4">
          <label for="genre" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Zhanri</label>
          <input type="text" id="genre" v-model="genre"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="P.sh. Aksion, Komedi, Dramë" required/>
        </div>

        <div class="mb-4">
          <label for="duration" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Kohëzgjatja (minuta)</label>
          <input type="number" id="duration" v-model="durationInMinutes"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="P.sh. 120" required/>
        </div>

        <div class="mb-6">
          <label for="posterUrl" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">URL e Posterit</label>
          <input type="url" id="posterUrl" v-model="posterUrl"
            class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="P.sh. https://example.com/poster.jpg" required/>
        </div>

        <button
          type="submit"
          :disabled="!isAdmin"
          :class="{'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
           'bg-red-600 hover:bg-red-700 text-white': isAdmin,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin}">
          SHTO FILM
        </button>

        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
        <p v-if="!isAdmin" class="text-yellow-400 mt-4">Ju nuk jeni i autorizuar të shtoni filma.</p>
      </form>
    </div>
  </div>
</template>