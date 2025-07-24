<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../assets/authVerification/useAuth.js';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const props = defineProps({
  showtimeId: {
    type: [String, Number],
    required: true
  }
});

const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);


const showtime = ref(null);
const seats = ref([]);
const selectedSeats = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const API_BASE_URL = 'https://localhost:7127';

const fetchShowtimeDetails = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Showtimes/${props.showtimeId}/details`);
    
    const data = response.data;
    showtime.value = data;
    seats.value = data.seats; 

  } catch (error) {
    console.error('Error fetching showtime details:', error);
    errorMessage.value = error.message || 'Dështoi ngarkimi i detajeve të shfaqjes.';
  } finally {
    loading.value = false;
  }
};

const toggleSeatSelection = (seatId) => {
  if (selectedSeats.value.includes(seatId)) {
    selectedSeats.value = selectedSeats.value.filter(id => id !== seatId);
  } else {
    selectedSeats.value.push(seatId);
  }
};

const seatsByRow = computed(() => {
  const rows = {};
  seats.value.forEach(seat => {
    if (!rows[seat.row]) {
      rows[seat.row] = [];
    }
    rows[seat.row].push(seat);
  });

  for (const rowKey in rows) {
    rows[rowKey].sort((a, b) => a.number - b.number);
  }

  return Object.keys(rows).sort().map(key => rows[key]);
});

const handleBooking = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!isAuthenticated.value) {
    errorMessage.value = 'Ju duhet të kyçeni për të rezervuar bileta.';
    router.push('/login');
    return;
  }

  if (selectedSeats.value.length === 0) {
    errorMessage.value = 'Ju lutemi zgjidhni të paktën një vend.';
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      errorMessage.value = 'Token autentifikimi mungon. Ju lutemi kyçuni.';
      router.push('/login');
      return;
    }

    const response = await axios.post(`${API_BASE_URL}/api/Bookings/book`, {
        showtimeId: props.showtimeId,
        seatIds: selectedSeats.value
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data =  response.data;

    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    console.log('showtimeId:', props.showtimeId);
    console.log('seatIds:', selectedSeats.value);
    console.log('Response body:', data);

    successMessage.value = `Rezervimi u krye me sukses! ${data.message || 'Konfirmuar.'}`;
    selectedSeats.value = [];

    setTimeout(() => {
      router.push(`/booking/${showtimeId}`); 
    }, 500);

    await fetchShowtimeDetails();

  } catch (error) {
    console.error('Gabim gjatë rezervimit:', error);
    errorMessage.value = error.message || 'Ndodhi një gabim i papritur i rrjetit.';
  }
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('sq-AL', { year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(() => {
  if (!isAuthenticated.value) {
    alert('Your are not loged in');
    router.push('/login')
    return;
  } else {
  fetchShowtimeDetails();
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-900 text-gray-100 pt-20">
    <div v-if="loading" class="text-white text-center text-lg">Duke ngarkuar detajet e shfaqjes...</div>
    <div v-else-if="errorMessage" class="text-red-500 text-center p-4 border border-red-700 rounded-md">
      {{ errorMessage }}
    </div>
    <div v-else-if="!showtime" class="text-white text-center text-lg">Nuk u gjetën detaje për këtë shfaqje.</div>

    <div v-else class="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl max-w-4xl w-full">
      <h1 class="text-3xl font-bold text-white mb-4 text-center">{{ showtime.movie?.title }}</h1>
      <p class="text-gray-300 text-center mb-6">{{ showtime.movie?.genre }} | {{ showtime.movie?.durationInMinutes }} min</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div class="flex flex-col items-center">
          <img :src="showtime.movie?.posterUrl" alt="Movie Poster"
               class="w-full max-w-xs h-96 object-cover rounded-lg shadow-md mb-4">
        </div>

        <div class="flex flex-col justify-start">
          <h3 class="text-xl font-semibold text-red-500 mb-2">Detajet e Shfaqjes:</h3>
          <p class="text-gray-300 mb-1">
            <i class="fas fa-calendar-alt mr-2 text-blue-400"></i>Data: {{ formatDate(showtime.startTime) }}
          </p>
          <p class="text-gray-300 mb-4">
            <i class="fas fa-clock mr-2 text-blue-400"></i>Ora: {{ formatTime(showtime.startTime) }}
          </p>

          <h3 class="text-xl font-semibold text-red-500 mb-2">Kinema:</h3>
          <p class="text-gray-300 mb-1">
            <i class="fas fa-building mr-2 text-blue-400"></i>Emri: {{ showtime.cinema?.name }}
          </p>
          <p class="text-gray-300 mb-4">
            <i class="fas fa-map-marker-alt mr-2 text-blue-400"></i>Lokacioni: {{ showtime.cinema?.location }}
          </p>

          <h3 class="text-xl font-semibold text-red-500 mb-4">Zgjidhni Vendet:</h3>
          <div class="bg-gray-700 p-4 rounded-lg shadow-inner mb-4">
            <div class="text-center text-white font-bold mb-4">Ekrani</div>
            <div class="flex flex-col items-center space-y-2">
              <div v-for="(row, rowIndex) in seatsByRow" :key="rowIndex" class="flex justify-center space-x-2">
                <div class="w-6 text-right text-gray-400 font-bold mr-2">{{ row[0].row }}</div>
                <div v-for="seat in row" :key="seat.id"
                     @click="!seat.isBooked ? toggleSeatSelection(seat.id) : null"
                     :class="[
                       'w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-colors duration-200',
                       seat.isBooked ? 'bg-red-700 text-white cursor-not-allowed' :
                       (selectedSeats.includes(seat.id) ? 'bg-blue-600 text-white' : 'bg-gray-500 hover:bg-gray-400 text-gray-900 cursor-pointer')
                     ]">
                  {{ seat.number }} 
                </div>
              </div>
            </div>
            <div class="flex justify-center mt-4 space-x-4 text-sm">
              <div class="flex items-center">
                <span class="w-4 h-4 rounded-full bg-blue-600 mr-2"></span>
                <span class="text-gray-300">Zgjedhur</span>
              </div>
              <div class="flex items-center">
                <span class="w-4 h-4 rounded-full bg-gray-500 mr-2"></span>
                <span class="text-gray-300">Në dispozicion</span>
              </div>
              <div class="flex items-center">
                <span class="w-4 h-4 rounded-full bg-red-700 mr-2"></span>
                <span class="text-gray-300">Zënë</span>
              </div>
            </div>
          </div>

          <p class="text-gray-300 text-center mb-4">Vendet e zgjedhura:{{ selectedSeats.length > 0 ? selectedSeats.map(id => {
              const seat = seats.find(s => s.id === id);
                return seat ? `${seat.row}${seat.number}` : null;
              }).filter(Boolean).join(', '): 'Asnjë'}}</p>
          <button
            @click="handleBooking"
            :disabled="selectedSeats.length === 0 || !isAuthenticated"
            :class="{
              'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
              'bg-red-600 hover:bg-red-700 text-white': selectedSeats.length > 0 && isAuthenticated,
              'bg-gray-500 text-gray-300 cursor-not-allowed': selectedSeats.length === 0 || !isAuthenticated
            }"
          >
            KONFIRMO REZERVIMIN
          </button>

          <p v-if="successMessage" class="text-green-400 mt-4 text-center">{{ successMessage }}</p>
          <p v-if="errorMessage" class="text-red-400 mt-4 text-center">{{ errorMessage }}</p>
          <p v-if="!isAuthenticated" class="text-yellow-400 mt-4 text-center">Ju lutemi kyçuni për të rezervuar bileta.</p>
        </div>
      </div>
    </div>
  </div>
</template>