<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import { storeToRefs } from 'pinia';
import BaseInput from '../atoms/BaseInput.vue';
import BaseButton from '../atoms/BaseButton.vue';
import { useApi } from '../../composables/useApi.js';

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);
const route = useRoute();
const router = useRouter();
const { put, get } = useApi();

const cinemaId = ref(null);
const name = ref('');
const location = ref('');
const numRows = ref(null);      
const seatsPerRow = ref(null);  

const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const isFormValid = computed(() => name.value && location.value);


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

  const response = await get(`/api/Cinemas/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response) {
      name.value = response.name;
      location.value = response.location;
      numRows.value = response.numRows;
      seatsPerRow.value = response.seatsPerRow;
    } else {
      errorMessage.value = 'Nuk u gjetën të dhënat e kinemasë.';
    }

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

  if (!isFormValid.value) {
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

      await put(`/api/Cinemas/${cinemaId.value}`, {
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
    
      <div v-if="loading" class="text-white" aria-live="polite">Duke ngarkuar të dhënat e kinemasë...</div>
      <div v-else-if="errorMessage && !isAdmin" class="text-red-400 mt-4" aria-live="assertive">{{ errorMessage }}</div>
      <div v-else-if="errorMessage" class="text-red-400 mt-4" aria-live="assertive">{{ errorMessage }}</div>
      <div v-else-if="!isAdmin" class="text-yellow-400 mt-4" aria-live="assertive">Ju nuk jeni i autorizuar të përditësoni kinema.</div>

      <form v-else @submit.prevent="handleUpdateCinema" aria-label="Forma per perditesimin e kinemase">
          <BaseInput
            type="text"
            id="name"
            label="Emri i Kinemasë"
            v-model="name"
            placeholder="Emri i Kinemasë"
            required/>

          <BaseInput
            type="text"
            id="location"
            v-model="location"
            label="Lokacioni"
            placeholder="Lokacioni i Kinemasë"
            required/>
        
        <BaseButton
          type="submit"
          :disabled="!isAdmin || loading"
          :class="{
            'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
            'bg-blue-600 hover:bg-blue-700 text-white': isAdmin && !loading,
            'bg-gray-500 text-gray-300 cursor-not-allowed': !isAdmin || loading}"
          aria-label="Përditëso Kinemanë">
          PËRDITËSO KINEMANË
        </BaseButton>

        <p v-if="successMessage" class="text-green-400 mt-4" aria-live="polite">{{ successMessage }}</p>
    </form>
</template>