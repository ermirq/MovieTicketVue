<script setup>
import SeatRow from '../molecules/SeatRow.vue';
import SeatLegend from '../molecules/SeatLegend.vue';

const props = defineProps({
  seatsByRow: { type: Array, required: true },
  selectedSeats: { type: Array, required: true },
});
</script>

<template>
  <div class="bg-gray-700 p-4 rounded-lg shadow-inner mb-4" aria-label="Hapësira e përzgjedhjes së ulëseve">
    <div class="text-center text-white font-bold mb-4">Ekrani</div>
    <div class="flex flex-col items-center space-y-2" aria-label="Rreshtat e ulëseve">
      <SeatRow
        v-for="(row, rowIndex) in seatsByRow"
        :key="rowIndex"
        :row="row"
        :selectedSeats="selectedSeats"
        @toggle="$emit('toggle', $event)"
      />
    </div>
    <SeatLegend />
  </div>
</template>