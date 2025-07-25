<script setup>
const props = defineProps({
  seat: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
});
</script>

<template>
  <div
    @click="!seat.isBooked && $emit('toggle', seat.id)"
    :class="[
      'w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-colors duration-200',
      seat.isBooked ? 'bg-red-700 text-white cursor-not-allowed' :
      (isSelected ? 'bg-blue-600 text-white' : 'bg-gray-500 hover:bg-gray-400 text-gray-900 cursor-pointer')
    ]">
    {{ seat.number }}
  </div>
</template>
