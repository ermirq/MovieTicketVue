<script setup>
import { RouterLink, useRouter, useRoute} from 'vue-router'; 
import { useAuthStore } from '../assets/authVerification/useAuth.js';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

const router = useRouter(); 
const authStore = useAuthStore();
const { isAuthenticated, loggedInUserIdentifier, isAdmin } = storeToRefs(authStore); 
const route = useRoute(); 

const isMoviePage = computed(() => {
  return route.path === '/';
});

const isCinemasPage = computed(() => {
  return route.path === '/kinemat';
});

const handleLogout = () => {
  authStore.clearAuth(); 
  router.push('/login'); 
  alert('Ju jeni çkyçur me sukses!');
};

console.log('isAdmin:', isAdmin.value)
</script>

<template>
  <nav class="fixed top-0 left-0 w-full bg-[#2b2b2b] text-white flex items-center justify-between px-6 py-3 shadow-md z-50">
    <div class="flex items-center space-x-8">
      <RouterLink to="/" class="text-red-600 font-bold text-xl italic tracking-widest hover:text-red-400 transition-colors duration-300">
        MovieTicketAPI
      </RouterLink>

      <ul class="flex space-x-6 text-sm font-medium">
        <router-link to="/" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="[isActive ? 'text-white' : 'text-gray-400 hover:text-white', 'cursor-pointer']">Filma</li>
        </router-link>

        <router-link to="/kinemat" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="[isActive ? 'text-white' : 'text-gray-400 hover:text-white', 'cursor-pointer']">Kinemat</li>
        </router-link>
      </ul>
    </div>

    <div class="flex items-center space-x-4 text-sm font-medium">
      <template v-if="isAuthenticated">
        <template v-if="isAdmin && isMoviePage">
          <router-link to="/add-movie" custom v-slot="{ navigate, isActive }">
            <li @click="navigate" :class="[isActive ? 'text-white' : 'text-gray-400 hover:text-white', 'list-none', 'cursor-pointer']">
              <i class="fas fa-plus-circle mr-1"></i>Shto Filma
            </li>
          </router-link>
        </template>
        <template v-if="isAdmin && isCinemasPage">
        <router-link to="/add-cinemas" custom v-slot="{ navigate, isActive }">
          <li @click="navigate" :class="[isActive ? 'text-white' : 'text-gray-400 hover:text-white', 'list-none', 'cursor-pointer']">
            <i class="fas fa-plus-circle mr-1"></i>Shto Kinema
          </li>
        </router-link>

          <router-link to="/add-showtime" custom v-slot="{ navigate, isActive }">
            <li @click="navigate" :class="[isActive ? 'text-white' : 'text-gray-400 hover:text-white', 'list-none', 'cursor-pointer']">
              <i class="fas fa-plus-circle mr-1"></i>Krijo Shfaqje
            </li>
          </router-link>
        </template>

        <router-link to="/myaccount" custom v-slot="{ navigate }">
          <button @click="navigate" class="flex items-center space-x-1 hover:text-gray-300">
            <i class="fas fa-user"></i>
            <span>{{ loggedInUserIdentifier || 'Llogaria ime' }}</span> </button>
        </router-link>

        <button @click="handleLogout" class="flex items-center space-x-1 text-red-600 hover:text-red-400 cursor-pointer">
          <i class="fas fa-sign-out-alt"></i> <span>Çkyçuni</span> </button>
      </template>

      <template v-else>
        <router-link to="/login" custom v-slot="{ navigate }">
          <button @click="navigate" class="flex items-center space-x-1 hover:text-gray-300 cursor-pointer">
            <i class="fas fa-user"></i><span>Kyçuni</span>
          </button>
        </router-link>

        <router-link to="/register" custom v-slot="{ navigate }">
          <button @click="navigate" class="flex items-center space-x-1 text-red-600 hover:text-red-400 cursor-pointer">
            <i class="fas fa-user-plus"></i><span>REGJISTROHUNI</span>
          </button>
        </router-link> 
      </template> 
    </div>
  </nav>
</template>