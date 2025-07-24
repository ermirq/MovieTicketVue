<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '../atoms/BaseButton.vue';
import AdminActions from './AdminActions.vue';

const props = defineProps({
  movie: Object,
  showtime: Object, 
  isAdmin: Boolean,
  variant: {
    type: String,
    default: 'home' 
  }
});

const emit = defineEmits(['delete', 'edit-showtime', 'delete-showtime']);
const router = useRouter();

const selectedShowtimeId = ref('');

const handleShowtimeChange = () => {
  if (selectedShowtimeId.value) {
    router.push(`/booking/${selectedShowtimeId.value}`);
  }
};

const handleDeleteMovie = () => {
  emit('delete', props.movie.id, props.movie.title);
};
const handleEditShowtime = () => {
  emit('edit-showtime', props.showtime.id);
};

const handleDeleteShowtime = () => {
  emit('delete-showtime', props.showtime.id, props.showtime.movie?.title); // Pass movie title for confirmation
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
  <div v-if="variant === 'home'" class="group bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 flex flex-col w-full max-w-xs sm:max-w-none cursor-pointer mb-10 relative">
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

      <div v-if="movie.showtimes && movie.showtimes.length">
        <select
          v-model="selectedShowtimeId"
          @change="handleShowtimeChange"
          class="mt-2 p-2 rounded bg-gray-600 border border-gray-300 dark:border-gray-600 text-white">
          <option disabled value="">Zgjidh shfaqjen</option>
          <option v-for="showtime in movie.showtimes" :key="showtime.id" :value="showtime.id">
            {{ formatDate(showtime.startTime) }} - {{ formatTime(showtime.startTime) }}
          </option>
        </select>
      </div>

      <div v-if="isAdmin" class="bg-red-600 hover:bg-red-700 text-white rounded-md mt-2">
        <BaseButton @click="handleDeleteMovie">
          <i class="fas fa-trash-alt"></i>
        </BaseButton>
      </div>
    </div>
  </div>

  <div v-else-if="variant === 'cinema'" class="bg-gray-700 bg-opacity-60 rounded-md flex flex-col items-center text-center p-2 w-full h-full">
    <img :src="showtime.movie?.posterUrl" alt="Movie Poster" class="w-full h-[300px] object-cover rounded-md mb-3">
    <h4 class="text-lg font-semibold text-white">{{ showtime.movie?.title }}</h4>

    <router-link :to="`/booking/${showtime.id}`" custom v-slot="{ navigate }">
      <BaseButton @click="navigate" class="mt-auto bg-red-600 hover:bg-red-700 text-white font-bold mt-2 py-2 px-4 rounded-md">
        Rezervo Biletën
      </BaseButton>
    </router-link>

    <div v-if="isAdmin" class="flex space-x-2 w-sm justify-center items-center mt-2">
      <AdminActions :iconOnly="true" @edit="handleEditShowtime" @delete="handleDeleteShowtime">
        <template #edit-text></template>
        <template #delete-text></template>
      </AdminActions>
    </div>
  </div>
</template>
