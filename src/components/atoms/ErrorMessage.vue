<script setup>
defineProps({
  message: { type: String, required: true },
});
</script>

<template>
  <div class="text-center text-red-500 text-lg" aria-live="assertive">
    {{ message }}
  </div>
</template>