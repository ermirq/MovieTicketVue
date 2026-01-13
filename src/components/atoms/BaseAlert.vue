<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
  },
});

const alertClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'p-3 text-green-400 bg-green-900 rounded';
    case 'error':
      return 'p-3 text-red-400 bg-red-900 rounded';
    case 'warning':
      return 'p-3 text-yellow-400 bg-yellow-900 rounded';
    default:
      return 'p-3 text-blue-400 bg-blue-900 rounded';
  }
});
</script>

<template>
  <div :class="alertClasses" role="alert">
    <slot />
  </div>
</template>