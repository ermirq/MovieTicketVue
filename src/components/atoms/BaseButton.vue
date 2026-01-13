<script setup>
const props = defineProps({
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
  },
  class: {
    type: [String, Array, Object],
    default: ''
  },
  ariaLabel: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <button
    :type="type"
    @click="$emit('click', $event)"
    :aria-label="ariaLabel || undefined"
    :class="['cursor-pointer text-white font-bold px-3 py-2 transition duration-300', props.class]"
  >
    <slot />
  </button>
</template>
