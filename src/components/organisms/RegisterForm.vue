<script setup lang="ts">
import BaseButton from '../atoms/BaseButton.vue';
import BaseInput from '../atoms/BaseInput.vue';
import PasswordInput from '../molecules/PasswordInput.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const username = ref('');
const email = ref('');
const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');
const password = ref('')
const errorMessage = ref ('');

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

</script>

<template>
    <form @submit.prevent="handleRegister">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <BaseInput v-model="username"
                label="Username"
                id="identifier"
                placeholder="Username" 
                required/>

            <BaseInput v-model="email"
                label="Email"
                id="email"
                placeholder="Email" 
                required/>
            
            <BaseInput v-model="firstName"
                label="Emri"
                id="firstName"
                placeholder="Emri" 
                required/>

            <BaseInput v-model="lastName"
                label="Mbiemri"
                id="lastName"
                placeholder="Mbiemri" 
                required/>

            <BaseInput v-model="phoneNumber"
                label="Numri i telefonit"
                id="phoneNumber"
                placeholder="Numri i telefonit" 
                required/>

            <PasswordInput v-model="password"
                label="Fjalëkalimi"
                id="password"
                placeholder="Fjalëkalimi" 
                required/>
        </div>
            <BaseButton type="submit" class="bg-red-700 mt-5">REGJISTROHUNI</BaseButton>
    </form>
</template>