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
    <label :for="id" class="block text-sm text-left font-medium mb-2 ml-4 text-gray-300">{{ label }}</label>
    <div class="relative w-full mb-5">
      <input
        :type="type"
        :id="id"
        :placeholder="placeholder"
        :aria-label="label"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white placeholder-gray-400 outline-none"
      />
    </div>
  </div>
</template>
