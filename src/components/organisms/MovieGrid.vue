<script setup>
import MovieCard from '../molecules/MovieCard.vue';

const props = defineProps({
  movies: { type: Array, default: () => [] },
  isAdmin: { type: Boolean, default: false }
});

const emit = defineEmits(['delete']);
const handleDelete = (movieId, movieTitle) => {
  emit('delete', movieId, movieTitle);
};
</script>


<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex flex-col w-full max-w-xs sm:max-w-none  mx-auto max-w-7xl justify-items-center">
    <MovieCard
      v-for="movie in movies"
      :aria-label="`Fshi filmin ${movie.name}`"
      :key="movie.id"
      :movie="movie"
      :isAdmin="isAdmin"
      variant="home"
      @delete="handleDelete"
    />
  </div>
</template>