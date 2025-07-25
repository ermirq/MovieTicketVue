<script setup>
import { defineProps, defineEmits } from 'vue';
import { formatDate, formatTime } from '../../assets/utils/dateUtils.js'; 

const props = defineProps({
  booking: { type: Object, required: true }
});

const emit = defineEmits(['deleteBooking']);

const handleDelete = () => {
  emit('deleteBooking', props.booking.id);
};
</script>

<template>
  <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
    <h2 class="text-xl text-red-400 mb-2">
      Rezervim për: <strong class="text-red-400">{{ booking.movieTitle }} </strong>
    </h2>
    <p><i class="fas fa-calendar-alt text-blue-400 mr-2"></i>Data: {{ formatDate(booking.showtime) }}</p>
    <p><i class="fas fa-clock text-blue-400 mr-2"></i>Ora: {{ formatTime(booking.showtime) }}</p>
    <p><i class="fas fa-chair text-green-400 mr-2"></i>Vendet: {{ booking.seats?.join(', ') || 'N/A' }}</p>
    <p><i class="fas fa-map-marker-alt text-yellow-400 mr-2"></i>Kinema: {{ booking.cinemaName }}</p>
    <div class="flex items-center justify-between mt-2">
      <p class="text-sm text-gray-400 mt-2">
        Rezervuar më: {{ new Date(booking.bookingTime).toLocaleString('sq-AL') }}
      </p>
      <button 
        @click="handleDelete" 
        class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
      >
        Fshi
      </button>
    </div>
  </div>
</template>
