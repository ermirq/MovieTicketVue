<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import { storeToRefs } from 'pinia';
import { useFetch } from '../../composables/useFetch.js';
import { useApi } from '../../composables/useApi.js';

import CinemaHeader from '../molecules/CinemaHeader.vue';
import CinemaList from '../organisms/CinemaList.vue';
import LoadingSpinner from '../atoms/LoadingSpinner.vue';
import ErrorMessage from '../atoms/ErrorMessage.vue';

const selectedCountry = ref('');
const router = useRouter();
const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);
const { del } = useApi();

const token = localStorage.getItem('userToken');

const { result: cinemas, loading, error, refetch } = useFetch('/api/Cinemas', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

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
    await del(`/api/Cinemas/${cinemaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    cinemas.value = cinemas.value.filter(c => c.id !== cinemaId);
    alert('Kinemaja u fshi me sukses!');
  } catch (err) {
    console.error('Gabim gjatë fshirjes së kinemasë:', err);
    alert(err.message || 'Gabim gjatë fshirjes së kinemasë.');
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
    await del(`/api/Showtimes/${showtimeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Shfaqja u fshi me sukses!');
    refetch(); 
  } catch (err) {
    console.error('Gabim gjatë fshirjes së shfaqjes:', err);
    alert(err.message || 'Gabim gjatë fshirjes së shfaqjes.');
  }
};
</script>

<template>
  <div class="bg-gray-900 text-gray-100 min-h-screen pt-20">
    <div class="container mx-auto px-4">
      <CinemaHeader v-model:modelValue="selectedCountry" aria-label="Filtro kinematë sipas vendit"/>

      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" aria-live="assertive">{{ error }}</ErrorMessage>
      <div v-else-if="filteredCinemas.length === 0" class="text-white text-center p-4" aria-live="polite">
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
