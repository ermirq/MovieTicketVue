<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import { storeToRefs } from 'pinia';
import axios from 'axios';

import CinemaHeader from '../molecules/CinemaHeader.vue';
import CinemaList from '../organisms/CinemaList.vue';
import LoadingSpinner from '../atoms/LoadingSpinner.vue';
import ErrorMessage from '../atoms/ErrorMessage.vue';

const API_BASE_URL = 'https://localhost:7127';

const cinemas = shallowRef([]);
const loading = ref(true);
const error = ref(null);
const selectedCountry = ref('');

const router = useRouter();
const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

const fetchCinemas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Cinemas`);
    cinemas.value = response.data;
  } catch (err) {
    console.error('Failed to fetch cinemas:', err);
    error.value = err.response?.data?.message || err.message || 'Gabim gjatë ngarkimit të kinemave.';
  } finally {
    loading.value = false;
  }
};

const filteredCinemas = computed(() =>
  !selectedCountry.value
    ? cinemas.value
    : cinemas.value.filter(cinema =>
        cinema.location.toLowerCase().includes(selectedCountry.value.toLowerCase())
      )
);

const handleEditCinema = (id) => {
  if (!isAdmin.value) {
    alert('Ju nuk jeni të autorizuar për të edituar kinema.');
    return;
  }
  router.push(`/edit-cinema/${id}`);
};

const handleEditShowtime = (id) => {
  if (!isAdmin.value) {
    alert('Ju nuk jeni të autorizuar për të edituar shfaqje.');
    return;
  }
  router.push(`/edit-showtime/${id}`);
};

const handleDeleteCinema = async (cinemaId, cinemaName) => {
  if (!isAdmin.value) {
    alert('Ju nuk jeni të autorizuar të fshini kinema.');
    return;
  }
  if (!confirm(`Jeni të sigurt që dëshironi të fshini kinemanë "${cinemaName}"? Kjo do të fshijë gjithashtu të gjitha vendet dhe shfaqjet e lidhura!`)) {
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push({ name: 'LoginPage', query: { redirect: router.currentRoute.value.fullPath } });
      return;
    }

    await axios.delete(`${API_BASE_URL}/api/Cinemas/${cinemaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    cinemas.value = cinemas.value.filter(c => c.id !== cinemaId);
    alert('Kinemaja u fshi me sukses!');
  } catch (err) {
    console.error('Gabim gjatë fshirjes së kinemasë:', err);
    error.value = err.message || 'Ndodhi një gabim i papritur gjatë fshirjes së kinemasë.';
  }
};

const handleDeleteShowtime = async (showtimeId, movieTitle) => {
  if (!isAdmin.value) {
    alert('Ju nuk jeni të autorizuar të fshini shfaqje.');
    return;
  }
  if (!confirm(`Jeni të sigurt që dëshironi të fshini shfaqjen për filmin "${movieTitle}"? Kjo do të fshijë gjithashtu të gjitha rezervimet e lidhura!`)) {
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push({ name: 'LoginPage', query: { redirect: router.currentRoute.value.fullPath } });
      return;
    }

    await axios.delete(`${API_BASE_URL}/api/Showtimes/${showtimeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Shfaqja u fshi me sukses!');
    await fetchCinemas();
  } catch (err) {
    console.error('Gabim gjatë fshirjes së shfaqjes:', err);
    error.value = err.message || 'Ndodhi një gabim i papritur gjatë fshirjes së shfaqjes.';
  }
};

onMounted(
  fetchCinemas
);
</script>

<template>
  <div class="bg-gray-900 text-gray-100 min-h-screen pt-20">
    <div class="container mx-auto px-4">
      <CinemaHeader v-model:modelValue="selectedCountry" />

      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error">{{ error }}</ErrorMessage>
      <div v-else-if="filteredCinemas.length === 0" class="text-white text-center p-4">
        Nuk u gjetën kinema.
      </div>
      <CinemaList
        v-else
        :cinemas="filteredCinemas"
        :isAdmin="isAdmin"
        @edit-cinema="handleEditCinema"
        @delete-cinema="handleDeleteCinema"
        @edit-showtime="handleEditShowtime"
        @delete-showtime="handleDeleteShowtime"
      />
    </div>
  </div>
</template>
