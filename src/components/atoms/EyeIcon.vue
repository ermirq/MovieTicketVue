<script setup>
defineProps({
  passwordFieldType: String 
});
const emit = defineEmits(['toggleVisibility']);
</script>

<template>
    <button type="button" @click="$emit('toggleVisibility')"
     class="absolute text-gray-400 hover:text-white" aria-label="Toggle password visibility">
      <svg
        v-if="passwordFieldType === 'password'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 
          4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7A10.05 
          10.05 0 0112 5c.424 0 .84.032 1.247.092m5.24 
          3.018A9.952 9.952 0 0012 5c4.478 0 8.268 2.943 9.542 
          7a10.05 10.05 0 01-.564 3.407M15 12a3 3 0 11-6 0 
          3 3 0 016 0zm-3 0a.75.75 0 100 1.5.75.75 0 000-1.5z" />
      </svg>
    </button>
</template>