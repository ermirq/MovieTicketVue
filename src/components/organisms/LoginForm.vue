<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../assets/authVerification/useAuth';
import BaseInput from '../atoms/BaseInput.vue';
import PasswordInput from '../molecules/PasswordInput.vue';
import BaseButton from '../atoms/BaseButton.vue';
import { useApi } from '../../composables/useApi';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';

const router = useRouter();
const { setAuth } = useAuthStore();
const errorMessage = ref('');
const loading = ref(false);
const {post} = useApi();

const schema = yup.object({
  indentifier: yup.string().required('UserName or email is required'),
  password: yup.string().required('Password is required')
})

const { errors } = useForm({
  validationSchema: schema,
  initialValues: {
    identifier: '',
    password: ''
  }
});

const { value: identifier } = useField('identifier');
const { value: password } = useField('password')

const handleLogin = async () => {
  errorMessage.value = '';
  loading.value = true;
  try {
      const data = await post('/api/ApplicationUser/login', {
      identifier: identifier.value,
      password: password.value,
    });

    if (!data.token) throw new Error('No token received');
    setAuth(data.token, data.identifier || identifier.value, data.roles || []);

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
    <BaseInput v-model="identifier" label="Username or Email" placeholder="Username or Email" :errors="errors.indentifier" />
    <PasswordInput v-model="password" label="Password" placeholder="Password" :errors="errors.password" />
      
    <div class="text-right text-sm text-gray-400 hover:text-blue-400 mr-1 mb-6">
      <a href="#">Keni harruar fjalëkalimin?</a>
    </div>

    <BaseButton type="submit"  class="bg-red-700 hover:bg-red-900 w-full rounded-full">KYÇUNI</BaseButton>

    <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
  </form>
</template>