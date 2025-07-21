<script setup>
import RegisterForm from '../organisms/RegisterForm.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-700 text-gray-100 bg-cover bg-center"
       style="background-image: url('https://plus.unsplash.com/premium_photo-1664303124313-126bf7456982?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center;">
    <div class="absolute inset-0 bg-black opacity-70"></div>
    <div class="relative mt-10 bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 class="text-3xl font-bold text-white mb-6 text-center">REGJISTROHUNI</h2>
        <RegisterForm />
      <p class="mt-8 text-gray-300 text-center">
        Keni tashmë një llogari?
        <router-link to="/login" class="font-bold text-white hover:text-blue-400 ml-1">
          KYÇUNI
        </router-link>
      </p>
    </div>
  </div>
</template>