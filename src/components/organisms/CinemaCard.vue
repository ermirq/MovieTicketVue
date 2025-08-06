<script setup>
import MovieCard from '../molecules/MovieCard.vue';
import AdminActions from '../molecules/AdminActions.vue';

const props = defineProps({
  cinema: Object,
  isAdmin: Boolean
});
const emit = defineEmits(['edit-cinema', 'delete-cinema', 'edit-showtime', 'delete-showtime']);

const editCinema = () => {
  emit('edit-cinema', props.cinema.id);
};
const deleteCinema = () => {
  emit('delete-cinema', props.cinema.id, props.cinema.name);
};
</script>

<template>
  <div
    class="bg-gray-800 bg-opacity-70 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow mb-10 duration-300"
    role="listitem"
    :aria-label="`Kinemaja ${cinema.name}, vendndodhja ${cinema.location}`"
  >
    <div class="relative w-full mb-2">
      <h2 class="text-2xl font-bold text-white text-center">
        {{ cinema.name }}
      </h2>

      <div v-if="isAdmin" class="absolute right-0 top-1/2 -translate-y-1/2">
        <AdminActions
          @edit="editCinema"
          @delete="deleteCinema"
          aria-label="Veprime për kinemanë"
        />
      </div>
    </div>

    <p class="text-gray-300 mb-4">{{ cinema.location }}</p>

    <div v-if="cinema.showtimes && cinema.showtimes.length > 0">
      <h3 class="text-xl font-semibold text-red-500 mb-3">
        Filmat dhe Shfaqjet (Movies & Showtimes):
      </h3>
      <div
        class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-5"
        role="list"
        aria-label="Lista e filmave dhe shfaqjeve për {{ cinema.name }}"
      >
        <MovieCard
          v-for="showtime in props.cinema.showtimes"
          :key="showtime.id"
          :movie="showtime.movie"
          :showtime="showtime"
          :isAdmin="isAdmin"
          variant="cinema"
          role="listitem"
          :aria-label="`Filmi ${showtime.movie?.title || 'pa titull'} në orën ${showtime.time}`"
          @edit-showtime="(id) => $emit('edit-showtime', id)"
          @delete-showtime="(id, title) => $emit('delete-showtime', id, title)" 
        />
      </div>
    </div>

    <div
      v-else
      class="text-gray-400 mt-4 text-center"
      role="status"
      aria-live="polite"
    >
      Nuk ka shfaqje të planifikuara për këtë kinema.
    </div>
  </div>
</template>
