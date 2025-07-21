<script setup>
import BaseButton from '../atoms/BaseButton.vue';
import BaseInput from '../atoms/BaseInput.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import axios from 'axios';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);
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
    <form @submit.prevent="handleAddCinema">
        <BaseInput v-model="name"
            label="Emri i Kinemasë"
            id="name"
            placeholder="Emri i Kinemasë"
            required/>

        <BaseInput v-model="location"
            label="Lokacioni"
            id="location"
            placeholder="Lokacioni i Kinemasë"
            required/>

        <BaseInput v-model.number="numRows" 
            label="Numri i Rreshtave"
            id="numRows"
            placeholder="Numri i rreshtave"
            min="1"
            max="26"
            required/>

        <BaseInput v-model.number="seatsPerRow"
            label="Vendet per rresht"
            id="seatsPerRow"
            placeholder="Vendet per rresht"
            min="1"
            required/>

        <BaseButton
          type="submit"
          :disabled="!isAdmin"
          :class="{
            'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
            'bg-red-600 hover:bg-red-700 text-white': isAdmin,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin}">
          SHTO KINEMA
        </BaseButton>

        <p v-if="successMessage" class="text-green-400 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
        <p v-if="!isAdmin" class="text-yellow-400 mt-4">Ju nuk jeni i autorizuar të shtoni kinema.</p>
      </form>
</template>