<script setup>
defineProps({
  type: {
    type: String,
    default: 'button', 
  },
  color: {
    type: String,
    default: 'primary'
  },
  onClick: {
    type: Function,
    default: null
  }
});
</script>


<template>
  <button :type="type"
   @click="$emit('click', $event)" 
   class="w-full cursor-pointer text-white font-bold px-3 py-2 rounded-full transition duration-300">
   <slot />
  </button>
</template>