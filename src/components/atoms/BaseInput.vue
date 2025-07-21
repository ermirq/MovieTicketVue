<script setup>
defineProps({
  modelValue: String,
  id: String,
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium mb-2 ml-2 text-gray-300">{{ label }}</label>
    <input :type="type" :id="id" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      class="w-full mb-4 px-4 py-3 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"/>
  </div>
</template>
