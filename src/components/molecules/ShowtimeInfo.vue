<script setup>
const props = defineProps({
  showtime: { type: Object, required: true },
  formatDate: { type: Function, required: true },
  formatTime: { type: Function, required: true },
});
</script>

<template>
  <div class="flex flex-col justify-start">
    <h3 class="text-xl font-semibold text-red-500 mb-2">Detajet e Shfaqjes:</h3>
    <p class="text-gray-300 mb-1">
      <i class="fas fa-calendar-alt mr-2 text-blue-400" role="img" aria-label="Ikonë e kalendarit"></i>
      Data: {{ formatDate(showtime.startTime) }}
    </p>
    <p class="text-gray-300 mb-4">
      <i class="fas fa-clock mr-2 text-blue-400" role="img" aria-label="Ikonë e orës"></i>
      Ora: {{ formatTime(showtime.startTime) }}
    </p>

    <h3 class="text-xl font-semibold text-red-500 mb-2">Kinema:</h3>
    <p class="text-gray-300 mb-1">
      <i class="fas fa-building mr-2 text-blue-400" role="img" aria-label="Ikonë e kinemasë"></i>
      Emri: {{ showtime.cinema?.name }}
    </p>
    <p class="text-gray-300 mb-4">
      <i class="fas fa-map-marker-alt mr-2 text-blue-400" role="img" aria-label="Ikonë e lokacionit"></i>
      Lokacioni: {{ showtime.cinema?.location }}
    </p>
  </div>
</template>