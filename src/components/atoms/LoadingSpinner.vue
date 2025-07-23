<script setup>
defineProps({
  message: { type: String, default: 'Loading...' },
});
</script>

<template>
  <div class="text-center text-gray-400 text-lg">
    {{ message }}
  </div>
</template>