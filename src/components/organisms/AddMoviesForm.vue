<script setup>
import BaseButton from '../atoms/BaseButton.vue';
import BaseInput from '../atoms/BaseInput.vue';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import { storeToRefs } from 'pinia';
import { useApi } from '../../composables/useApi.js';

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore); 
const router = useRouter();
const route = useRoute();
const { post } = useApi();

const title = ref('');
const description = ref('');
const genre = ref('');
const durationInMinutes = ref(''); 
const posterUrl = ref(''); 
const errorMessage = ref('');
const successMessage = ref('');

const handleAddMovie = async () => {
  if (!isAdmin.value) {
    router.push({ name: 'LoginPage', query: { redirect: route.fullPath } });
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
      router.push({ name: 'LoginPage', query: { redirect: route.fullPath } });
      return;
    }

    await post('/api/Movies', {
        title: title.value,
        description: description.value,
        genre: genre.value,
        durationInMinutes: parseInt(durationInMinutes.value),
        posterUrl: posterUrl.value
    },
    { headers: { 'Authorization': `Bearer ${token}` } });

    successMessage.value = 'Filmi u shtua me sukses!'; 
    title.value = description.value = genre.value = posterUrl.value = '';
    durationInMinutes.value = '';

    setTimeout(() => {
      router.push('/'); 
    }, 500);

  } catch (error) {
    console.error('Gabim gjatë shtimit të filmit:', error); 
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Ndodhi një gabim i papritur i rrjetit.';
  }
};
</script>

<template>
  <form @submit.prevent="handleAddMovie" aria-label="Forma per shtimin e filmit"> <BaseInput id="title"
      label="Titulli"
      v-model="title"
      placeholder="Titulli i filmit" required />

    <BaseInput id="description"
      v-model="description" 
      rows="4" 
      label="Përshkrimi" 
      placeholder="Përshkrimi i filmit" required />

    <BaseInput id="genre"
      v-model="genre" label="Zhanri"
      placeholder="P.sh. Aksion, Komedi, Dramë" required />

    <BaseInput id="duration"
     v-model="durationInMinutes" 
     label="Kohëzgjatja (minuta)" 
     placeholder="P.sh. 120" required />

    <BaseInput id="posterUrl" 
     v-model="posterUrl" 
     label="URL i posterit" 
     placeholder="P.sh. https://example.com/poster.jpg" required />

    <BaseButton
      type="submit"
      :disabled="!isAdmin"
      :class="{
        'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
        'bg-red-600 hover:bg-red-700 text-white': isAdmin,
        'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin
      }"
      aria-label="Shto Film"> SHTO FILM
    </BaseButton>

    <p v-if="successMessage" class="text-green-400 mt-4" aria-live="polite">{{ successMessage }}</p> <p v-if="errorMessage" class="text-red-400 mt-4" aria-live="polite">{{ errorMessage }}</p> </form>
</template>