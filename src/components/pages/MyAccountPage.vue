<script setup>
import { ref, onMounted, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js'; 
import { storeToRefs } from 'pinia';
import { useApi } from '../../composables/useApi.js';
import { useFetch } from '../../composables/useFetch.js';

import BaseTitle from '../atoms/BaseTitle.vue';
import BaseAlert from '../atoms/BaseAlert.vue';
import BookingCard from '../molecules/BookingCard.vue';

const bookings = shallowRef([]);
const loading = ref(true);
const errorMessage = ref('');
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const router = useRouter();
const { del } = useApi();

const fetchBookings = () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    router.push('/login');
    return;
  }

  const { result, error, loading: fetchLoading } = useFetch('/api/Bookings/user-bookings', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  watch(result, (data) => {
    if (data) bookings.value = data;
  });

  watch(error, (err) => {
    if (err) errorMessage.value = err;
  });

  watch(fetchLoading, (isLoading) => {
    loading.value = isLoading;
  });
};

const deleteBooking = async (bookingId) => {
  if (!confirm('A jeni të sigurtë që doni ta fshini rezervimin?')) return; 

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }

    await del(`/api/Bookings/${bookingId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    bookings.value = bookings.value.filter(b => b.id !== bookingId);
    alert('Rezervimi u fshi me sukses!');
  } catch (error) {
    errorMessage.value = error.message || 'Gabim gjatë fshirjes së rezervimit.';
  }
};

onMounted(() => {
  if (!isAuthenticated.value) {
    alert('Ju nuk jeni i loguar');
    router.push('/login');
  } else {
    fetchBookings();
  }
});
</script>


<template>
  <div class="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-900 text-gray-100 pt-20">
    <BaseTitle v-once>Llogaria Ime - Rezervimet</BaseTitle>

    <div v-if="loading" class="text-white text-lg text-center">Duke ngarkuar rezervimet...</div>
    <BaseAlert v-else-if="errorMessage" type="error">{{ errorMessage }}</BaseAlert>
    <div v-else-if="bookings.length === 0" class="text-white text-lg text-center">
      Nuk keni bërë asnjë rezervim.
    </div>

    <div v-else class="w-full max-w-4xl space-y-6">
      <BookingCard 
        v-for="booking in bookings" 
        :key="booking.id" 
        :booking="booking"
        @deleteBooking="deleteBooking"
      />
    </div>
  </div>
</template>
