<script setup>
defineProps({
  classes: { type: String, default: 'text-3xl font-bold text-white text-center' }
});
</script>

<template>
  <h1 :class="classes">
    <slot />
  </h1>
</template>