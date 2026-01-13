<script setup>
import BaseSelect from '../atoms/BaseSelect.vue';
import Heading from '../atoms/Heading.vue';

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);

const countryOptions = [
  { id: '', title: 'Të gjitha shtetet' },
  { id: 'kosovo', title: 'Kosovo' },
  { id: 'albania', title: 'Albania' }
];
</script>

<template>
  <div class="w-full bg-gray-900 z-40 px-4 py-2 shadow-xl mb-6">
    <div class="flex justify-between items-center gap-3 max-w-7xl mx-auto">
      <Heading>Kinemat (Cinemas)</Heading>

      <div class="flex flex-col items-start text-white">
        <BaseSelect
          id="country-select"
          :options="countryOptions"
          v-model:modelValue="props.modelValue"
          aria-label="Zgjidh vendin për filtrimin e kinemave"
        />
      </div>
    </div>
  </div>
</template>
