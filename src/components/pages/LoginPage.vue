<script setup>
import LoginForm from '../organisms/LoginForm.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-700 text-gray-100 bg-cover bg-center"
       style="background-image: url('https://plus.unsplash.com/premium_photo-1664303124313-126bf7456982?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center;"
       aria-label="Faqja e kyçjes">
    <div class="absolute inset-0 bg-black opacity-70" aria-hidden="true"></div>
    <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 class="text-3xl font-bold text-white mb-6 text-center">KYÇUNI</h2>
      <LoginForm />
      <p class="mt-8 text-gray-300 text-center">
        Nuk jeni anëtar i Cineplexx?
        <router-link to="/register" class="font-bold text-white hover:text-blue-400 ml-1" aria-label="Regjistrohuni">
          REGJISTROHUNI
        </router-link>
      </p>
    </div>
  </div>
</template>