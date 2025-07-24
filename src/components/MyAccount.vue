<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js'; 
import axios from 'axios';
import { storeToRefs } from 'pinia';

const bookings = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const router = useRouter();

const API_BASE_URL = 'https://localhost:7127'; 

const fetchBookings = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }


    const response = await axios.get(`${API_BASE_URL}/api/Bookings/user-bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = response.data;

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    bookings.value = data;
    console.log('Fetched bookings:', bookings.value); 

  } catch (error) {
    console.error('Error fetching bookings:', error);
    errorMessage.value = error.message || 'Gabim gjatë marrjes së rezervimeve.';
  } finally {
    loading.value = false;
  }
};

const deleteBooking = async (bookingId) => {
  if (!confirm('A jeni te sigurtë që doni ta fshini rezervimin?')) {
    return; 
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await axios.delete(`${API_BASE_URL}/api/Bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    bookings.value = bookings.value.filter(b => b.id !== bookingId);
    alert('Rezervimi u fshie me sukses!');

  } catch (error) {
    console.error('Error cancelling booking:', error);
    errorMessage.value = error.message || 'Error occurred while cancelling booking.';
  }
};
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

onMounted(() => {
  if (!isAuthenticated.value) {
    alert('Your are not loged in');
    router.push('/login');
  } else {
    fetchBookings();
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-900 text-gray-100 pt-20">
    <h1 class="text-3xl font-bold mb-6 text-center text-white">Llogaria Ime - Rezervimet</h1>

        <div v-if="loading" class="text-white text-lg text-center">Duke ngarkuar rezervimet...</div>
        <div v-else-if="errorMessage" class="text-red-400 text-center p-4 border border-red-700 rounded-md">
        {{ errorMessage }}
        </div>
        <div v-else-if="bookings.length === 0" class="text-white text-lg text-center">
        Nuk keni bërë asnjë rezervim.
        </div>
        <div v-else class="w-full max-w-4xl space-y-6">
            <div v-for="booking in bookings" :key="booking.id" class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 class="text-xl font-semibold text-red-400 mb-2">Rezervim për: {{ booking.movieTitle }}</h2>
                <p><i class="fas fa-calendar-alt text-blue-400 mr-2"></i>Data: {{ formatDate(booking.showtime) }}</p>
                <p><i class="fas fa-clock text-blue-400 mr-2"></i>Ora: {{ formatTime(booking.showtime) }}</p>
                <p><i class="fas fa-chair text-green-400 mr-2"></i>Vendet: {{ booking.seats?.join(', ') || 'N/A' }}</p>
                <p><i class="fas fa-map-marker-alt text-yellow-400 mr-2"></i>Kinema: {{ booking.cinemaName }}</p>
                <div class="flex items-center justify-between mt-2">
                    <p class="text-sm text-gray-400 mt-2">Rezervuar më: {{ new Date(booking.bookingTime).toLocaleString('sq-AL') }}</p>
                    <button @click="deleteBooking(booking.id)" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center">
                        Fshi
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>