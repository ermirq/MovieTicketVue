<script setup>
import { ref, onMounted, computed, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth.js';
import { storeToRefs } from 'pinia';
import { formatDate, formatTime } from '../../assets/utils/dateUtils.js';
import { useApi } from '../../composables/useApi.js';
import BaseTitle from '../atoms/BaseTitle.vue';
import BaseButton from '../atoms/BaseButton.vue';
import BaseAlert from '../atoms/BaseAlert.vue';
import SeatSelection from '../organisms/SeatSelection.vue';
import ShowtimeInfo from '../molecules/ShowtimeInfo.vue';
import { useFetch } from '../../composables/useFetch.js';

const props = defineProps({
  showtimeId: { type: [String, Number], required: true }
});

const { get, post } = useApi();
const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const showtime = shallowRef(null);
const seats = shallowRef([]);
const selectedSeats = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

const token = localStorage.getItem('userToken');
if (!token) {
  router.push('/login');
}

const { result: showtimeData, error, loading, refetch } = useFetch(
  `/api/Showtimes/${props.showtimeId}/details`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

watch(showtimeData, (data) => {
  if (data) {
    showtime.value = data;
    seats.value = data.seats || [];
  }
});

watch(error, (err) => {
  if (err) errorMessage.value = err;
});

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
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });
  for (const rowKey in rows) rows[rowKey].sort((a, b) => a.number - b.number);
  return Object.keys(rows).sort().map(key => rows[key]);
});

const handleBooking = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }

  if (!selectedSeats.value.length) {
    errorMessage.value = 'Ju lutemi zgjidhni të paktën një vend.';
    return;
  }

  try {
    await post(
      '/api/Bookings/book',
      {
        showtimeId: props.showtimeId,
        seatIds: selectedSeats.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    successMessage.value = 'Rezervimi u krye me sukses!';
    selectedSeats.value = [];
    refetch(); 

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = error.message || 'Ndodhi një gabim i papritur.';
  }
};

const selectedSeatLabels = computed(() => {
  return selectedSeats.value
    .map(id => {
      const seat = seats.value.find(s => s.id === id);
      return seat ? `${seat.row}${seat.number}` : null;
    })
    .filter(Boolean)
    .join(', ') || 'Asnjë';
});

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
  }
});
</script>


<template>
  <div class="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-900 text-gray-100 pt-20">
    <BaseTitle v-once>Rezervimi i Biletave</BaseTitle>

    <div v-if="loading" class="text-white text-center text-lg">Duke ngarkuar detajet e shfaqjes...</div>
    <BaseAlert v-else-if="errorMessage" type="error">{{ errorMessage }}</BaseAlert>
    <div v-else-if="!showtime" class="text-white text-center text-lg">Nuk u gjetën detaje për këtë shfaqje.</div>
    
    <div v-else class="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl max-w-4xl w-full">
      <h1 class="text-3xl font-bold text-white mb-2 text-center">{{ showtime.movie?.title }}</h1>
      <p class="text-gray-300 text-center mb-6">{{ showtime.movie?.genre }} | {{ showtime.movie?.durationInMinutes }} min</p>

      <div class="flex flex-col md:flex-row gap-8 items-start justify-center">
        <div class="flex flex-col items-center">
          <img
            :src="showtime.movie?.posterUrl"
            alt="Movie Poster"
            class="w-full max-w-xs h-auto object-cover rounded-lg shadow-md"
          />
          </div>

        <div class="flex flex-col items-start w-full md:w-auto">
          <ShowtimeInfo :showtime="showtime" :formatDate="formatDate" :formatTime="formatTime" class="mb-6" /> 
          
          <h3 class="text-xl font-semibold text-red-500 mb-4">Zgjidhni Vendet:</h3>
          <SeatSelection :seatsByRow="seatsByRow" :selectedSeats="selectedSeats" @toggle="toggleSeatSelection" />
        </div>
      </div>
    
      <p class="text-gray-300 text-center my-4">Vendet e zgjedhura: {{ selectedSeatLabels }}</p>

      <BaseButton
        :disabled="selectedSeats.length === 0 || !isAuthenticated"
        :class="{
          'w-full font-bold py-3 px-4 rounded-full transition duration-300': true,
          'bg-red-600 hover:bg-red-700 text-white': selectedSeats.length > 0 && isAuthenticated,
          'bg-gray-500 text-gray-300 cursor-not-allowed': selectedSeats.length === 0 || !isAuthenticated
        }" 
        @click="handleBooking"
      >
        KONFIRMO REZERVIMIN
      </BaseButton>

      <BaseAlert v-if="successMessage" type="success" class="mt-4 text-center rounded-full">{{ successMessage }}</BaseAlert>
    </div>
  </div>
</template>