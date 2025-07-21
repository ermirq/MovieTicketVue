<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import axios from 'axios';

const router = useRouter();

const username = ref('');
const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');
const email = ref('');
const password = ref('');
const passwordFieldType = ref('password');

const API_BASE_URL = 'https://localhost:7127';

const handleRegister = async () => {
  if (username.value && firstName.value && lastName.value && phoneNumber.value && email.value && password.value) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ApplicationUser/register`, {
          username: username.value,
          firstName: firstName.value,
          lastName: lastName.value,
          phoneNumber: phoneNumber.value,
          email: email.value,
          password: password.value
        },
        {
            headers: {
          'Content-Type': 'application/json'
            }
        }
    );

      alert('Regjistrimi u krye me sukses!');
      router.push('/login'); 

    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.message);
    }
  } else {
    alert('Please fill in all fields.');
  }
};

const togglePasswordVisibility = () => {
    passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center mt-10 bg-gray-900 text-gray-100"
       style="background-image: url('https://plus.unsplash.com/premium_photo-1664303124313-126bf7456982?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center;">
        <div class="absolute inset-0 bg-black opacity-70"></div>

        <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
            <h2 class="text-3xl font-bold text-white mb-6">REGJISTROHUNI</h2>

            <form @submit.prevent="handleRegister">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label for="username" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Username</label>
                            <input type="text" id="username" v-model="username"
                                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
                                placeholder="Username" required/>
                        </div>

                        <div>
                            <label for="firstName" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Emri</label>
                            <input type="text" id="firstName" v-model="firstName"
                                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
                                placeholder="Emri" required/>
                        </div>

                        <div>
                            <label for="lastName" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Mbiemri</label>
                            <input type="text" id="lastName" v-model="lastName"
                                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
                                placeholder="Mbiemri" required/>
                        </div>

                        <div>
                            <label for="phoneNumber" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Numri i telefonit</label>
                            <input type="tel" id="phoneNumber" v-model="phoneNumber"
                                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
                                placeholder="Numri i telefonit" required/>
                        </div>

                        <div>
                            <label for="email" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Email</label>
                            <input type="email" id="email" v-model="email"
                                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
                                placeholder="Email" required/>
                        </div>

                        <div class="relative"> 
                            <label for="password" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">Fjalëkalimi</label>
                            <input :type="passwordFieldType" id="password" v-model="password"
                                class="w-full px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none pr-12"
                                placeholder="Fjalëkalimi" required/>
                            <button type="button" @click="togglePasswordVisibility"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 mt-0 text-gray-400 hover:text-white focus:outline-none mt-3.5"
                                aria-label="Toggle password visibility">
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
                    </div>

                    <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 mt-6">
                        REGJISTROHUNI
                    </button>

                    <p v-if="successMessage" class="text-green-400 mt-2">{{ successMessage }}</p>
                    <p v-if="errorMessage" class="text-red-400 mt-2">{{ errorMessage }}</p>
                </form>
            <p class="mt-8 text-gray-300">
                Keni tashmë një llogari?
                <router-link to="/login" class="font-bold text-white hover:text-blue-400 ml-1">KYÇUNI</router-link>
            </p>
        </div>
    </div>
</template>