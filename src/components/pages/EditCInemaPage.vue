<script setup>
import EditCinemaForm from '../organisms/EditCinemaForm.vue';
</script>

<template>
    <div class="min-h-screen flex items-center justify-center py-8 px-4 bg-gray-900 text-gray-100">
        <div class="relative bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-md w-full mt-10 z-20" aria-label="Përditëso Kinemanë">
        <h2 class="text-3xl font-bold text-white mb-6">PËRDITËSO KINEMANË</h2>
        <EditCinemaForm />
        </div>
    </div>
</template>