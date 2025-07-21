
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { useAuthStore } from '../assets/authVerification/useAuth';
import axios from 'axios';

const router = useRouter(); 
const { setAuth } = useAuthStore();
const identifier = ref('');
const password = ref('');
const isAdmin = ref(false);
const passwordFieldType = ref('password'); 
const errorMessage = ref('');


const API_BASE_URL = 'https://localhost:7127'; 

const handleLogin = async () => {
 errorMessage.value = ''; 

  
  console.log('Identifier value:', identifier.value);
  console.log('Password value:', password.value);
  console.log('isAdmin:', isAdmin.value);

  if (!identifier.value || !password.value) {
    errorMessage.value = 'Please enter both your email/username and password.';
    console.error('Validation failed: Identifier or password is empty.'); 
    return; 
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/ApplicationUser/login`, { 
        identifier: identifier.value,
        password: password.value
    });
    const data = response.data;

    const token = data.token;
    const roles = data.roles || [];  

    console.log('Token:', token);
    console.log('Roles:', roles);

    console.log('Full login response:', data);
    
    if (token) {
      setAuth(token, identifier.value, Array.from(roles));

      alert('Kyçja u krye me sukses!');
      router.push('/');

    } else {
      throw new Error('Login successful but no authentication token received.');
    }

  } catch (error) {
    console.error('Error during login:', error);
    errorMessage.value = error.message; 
  }

  if (error.response) {
    errorMessage.value = error.response.data.message || 'Kyçja dështoi. Kontrolloni kredencialet.';
  } else {
    errorMessage.value = error.message;
  }
};

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100"
       style="background-image: url('https://plus.unsplash.com/premium_photo-1664303124313-126bf7456982?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center;">
    <div class="absolute inset-0 bg-black opacity-70"></div>

    <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
      <h2 class="text-3xl font-bold text-white mb-6">KYÇUNI</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-5">
          <label for="identifier" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Email or Username</label>
          <input
            type="text"
            id="identifier"
            v-model="identifier"    
            class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
            placeholder="Email or Username"
            required
          />
        </div>

        <div class="mb-6 relative">
          <label for="password" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Fjalëkalimi</label>
          <input
            :type="passwordFieldType"
            id="password"
            v-model="password"
            class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none pr-12"
            placeholder="Fjalëkalimi"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-4 top-1/2 mt-3.5 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
            aria-label="Toggle password visibility"
          >
            <svg
              v-if="passwordFieldType === 'password'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7A10.05 10.05 0 0112 5c.424 0 .84.032 1.247.092m5.24 3.018A9.952 9.952 0 0012 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-.564 3.407M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 0a.75.75 0 100 1.5.75.75 0 000-1.5z"
              />
            </svg>
          </button>
        </div>

        <a href="#" class="block text-right text-sm text-gray-400 hover:text-blue-400 mb-6">
          Keni harruar fjalëkalimin?
        </a>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition duration-300"
        >
          KYÇUNI
        </button>

        <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
      </form>

      <p class="mt-8 text-gray-300">
        Nuk jeni anëtar i Cineplexx?
        <router-link to="/register" class="font-bold text-white hover:text-blue-400 ml-1">REGJISTROHUNI</router-link>
      </p>
    </div>
  </div>
</template>