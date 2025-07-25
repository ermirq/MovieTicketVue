<script setup>
import Seat from '../atoms/Seat.vue';

const props = defineProps({
  row: { type: Array, required: true },
  selectedSeats: { type: Array, required: true }
});
</script>

<template>
  <div class="flex justify-center space-x-2">
    <div class="w-6 text-right text-gray-400 font-bold mr-2">{{ row[0]?.row }}</div>
    <Seat
      v-for="seat in row"
      :key="seat.id"
      :seat="seat"
      :isSelected="selectedSeats.includes(seat.id)"
      @toggle="$emit('toggle', seat.id)"
    />
  </div>
</template>
