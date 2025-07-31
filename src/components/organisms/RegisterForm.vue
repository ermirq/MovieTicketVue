<script setup>
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import BaseInput from '../atoms/BaseInput.vue';
import BaseButton from '../atoms/BaseButton.vue';
import { useApi } from '../../composables/useApi';    
import PasswordInput from '../molecules/PasswordInput.vue';

const router = useRouter();
const { post } = useApi();

const schema = yup.object({
  username: yup.string().required('Username is required').min(3),
  email: yup.string().required('Email is required').email('Invalid email'),
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  password: yup.string().required('Password is required').min(8),
  phoneNumber: yup.string().matches(/^\d+$/, 'Must be numbers only').required('Phone number is required')
  });

const { errors } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '', 
  },
});

const { value: username } = useField('username');
const { value: email } = useField('email');
const { value: firstName} = useField('firstName');
const { value: lastName } = useField('lastName')
const { value: password } = useField('password');
const { value: phoneNumber} = useField('phoneNumber');

const handleRegister = async () => {
  if (username.value && firstName.value && lastName.value && phoneNumber.value && email.value && password.value) {
    try {
      const response = await post(`/api/ApplicationUser/register`, {
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
  <form @submit.prevent="handleRegister" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <BaseInput v-model="username" label="Username" placeholder="Username" :error="errors.username" />
      <BaseInput v-model="email" label="Email" placeholder="Email" :error="errors.email" />
      <BaseInput v-model="firstName" label="Emri" placeholder="Emri" :error="errors.firstName" />
      <BaseInput v-model="lastName" label="Mbiemri" placeholder="Mbiemri" :error="errors.lastName"/>
      <PasswordInput v-model="password" type="password" label="Password" placeholder="Password" :error="errors.password" />
      <BaseInput v-model="phoneNumber" label="Numri i telefonit" placeholder="Numri i telefonit" :error="errors.phoneNumber"/>
    </div>

    <BaseButton type="submit" class="bg-red-700 w-full rounded-full">REGJISTROHUNI</BaseButton>
  </form>
</template>
