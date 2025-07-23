<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth';
import axios from 'axios';
import BaseInput from '../atoms/BaseInput.vue';
import PasswordInput from '../molecules/PasswordInput.vue';
import BaseButton from '../atoms/BaseButton.vue';

const router = useRouter();
const { setAuth } = useAuthStore();
const identifier = ref('');
const password = ref('');
const errorMessage = ref('');

const API_BASE_URL = 'https://localhost:7127';

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ApplicationUser/login`, {
      identifier: identifier.value,
      password: password.value,
    });
    const data = response.data;
    if (!data.token) throw new Error('No token received');
    setAuth(data.token, identifier.value, data.roles || []);
    alert('Kyçja u krye me sukses!');
    router.push('/');
  } catch (error) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.message || 'Kyçja dështoi. Kontrolloni kredencialet.';
  }
};
</script>


<template>
  <form @submit.prevent="handleLogin">
    <BaseInput
      v-model="identifier"
      label="Email or Username"
      id="identifier"
      placeholder="Email or Username"
      required/>

    <PasswordInput
      v-model="password"
      label="Fjalëkalimi"
      id="password"
      placeholder="Fjalëkalimi"
      required/>
      
    <div class="text-right text-sm text-gray-400 hover:text-blue-400 mr-1 mb-6">
      <a href="#">Keni harruar fjalëkalimin?</a>
    </div>

    <BaseButton type="submit"  class="bg-red-700 hover:bg-red-900">KYÇUNI</BaseButton>

    <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
  </form>
</template>