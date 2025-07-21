<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  options: { type: Array, default: () => [] }, 
  modelValue: [String, Number], 
  valueKey: { type: String, default: 'id' }, 
  labelKey: { type: String, default: 'title' }, 
});

defineEmits(['update:modelValue']);
</script>


<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-left text-gray-300 text-sm font-medium mb-2 ml-1">
      {{ label }}
    </label>

    <select
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full mb-4 px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white outline-none appearance-none"
      required
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option[valueKey]" :value="option[valueKey]">
        {{ option[labelKey] }}
      </option>
    </select>
  </div>
</template>