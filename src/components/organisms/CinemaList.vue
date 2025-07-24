<script setup>
import CinemaCard from './CinemaCard.vue';
const props = defineProps({
  cinemas: Array,
  isAdmin: Boolean
});
const emits = defineEmits(['edit-cinema', 'delete-cinema', 'edit-showtime', 'delete-showtime']);
</script>

<template>
  <div class="text-center grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mt-10">
    <CinemaCard
      v-for="cinema in props.cinemas"
      :key="cinema.id"
      :cinema="cinema"
      :isAdmin="isAdmin"
      @edit-cinema="(id) => $emit('edit-cinema', id)"
      @delete-cinema="(id, name) => $emit('delete-cinema', id, name)" 
      @edit-showtime="(id) => $emit('edit-showtime', id)"
      @delete-showtime="(id, title) => $emit('delete-showtime', id, title)"
    />
  </div>
</template>