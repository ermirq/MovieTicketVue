<script setup>
import BaseButton from '../atoms/BaseButton.vue';

const props = defineProps({
  movie: { type: Object, required: true },
  isAdmin: { type: Boolean, default: false }
});
const emit = defineEmits(['delete']);
const handleDelete = (movieId, movieTitle) => {
  emit('delete', movieId, movieTitle);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
</script>

<template>
  <div
    class="group bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 flex flex-col w-full max-w-xs sm:max-w-none cursor-pointer mb-10 relative">
    <img :src="movie.posterUrl || 'https://via.placeholder.com/250x370?text=No+Poster'" alt="Movie Poster" class="w-full h-auto object-cover"/>

    <div class="p-4 flex flex-col justify-end flex-grow">
      <h3 class="text-l font-bold mb-2 text-gray-900 dark:text-white uppercase">{{ movie.title }}</h3>
      <p class="text-sm text-gray-700 dark:text-gray-400">
        Filmi fillon:
        <span v-if="movie.showtimes?.length">
          {{ formatDate(movie.showtimes[0].startTime) }} <br /> Ora: {{ formatTime(movie.showtimes[0].startTime) }}
        </span>
        <span v-else>N/A</span>
      </p>
    </div>

    <div class="absolute bottom-0 left-0 right-0 bg-white text-black p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in flex flex-col justify-center items-center text-sm">
      <p class="text-center mb-2">{{ movie.description || 'No description available.' }}</p>
      <p class="text-center mb-1"><strong>Kategoria:</strong> {{ movie.genre || 'N/A' }}</p>
      <p class="text-center"><strong>Kohëzgjatja:</strong> {{ movie.durationInMinutes ? movie.durationInMinutes + ' min' : 'N/A' }}</p>

      <div v-if="isAdmin" class="bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center mt-2">
        <BaseButton @click="handleDelete(movie.id, movie.title)">
          <i class="fas fa-trash-alt"></i>
        </BaseButton>
      </div>
    </div>
  </div>
</template>