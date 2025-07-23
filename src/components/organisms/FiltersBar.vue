<script setup>
import { ref, watch } from 'vue';
import BaseInput from '../atoms/BaseInput.vue';
import BaseSelect from '../atoms/BaseSelect.vue';
const props = defineProps({
  search: { type: String, default: '' },
  countries: { type: Array, required: true },
  dates: { type: Array, default: () => [] },
  selectedCountry: { type: String, default: '' },
  selectedDate: { type: String, default: '' }
});
const emit = defineEmits(['update:search', 'update:selectedCountry', 'update:selectedDate', 'search']);

const searchQuery = ref(props.search);
const country = ref(props.selectedCountry);
const date = ref(props.selectedDate);

watch(() => props.search, val => searchQuery.value = val);
watch(() => props.selectedCountry, val => country.value = val);
watch(() => props.selectedDate, val => date.value = val);

const searchMovies = () => {
  emit('update:search', searchQuery.value);
  emit('search');
};

const updateCountry = (value) => {
  country.value = value;
  emit('update:selectedCountry', country.value);
};

const updateDate = (value) => {
  date.value = value;
  emit('update:selectedDate', date.value);
};
</script>

<template>
  <div class="w-full bg-white dark:bg-gray-900 z-40 py-2 shadow-sm mb-6">
    <div class="flex justify-end mt-15 gap-3 max-w-7xl mx-auto">   
      <div class="flex justify-center items-center gap-3">   
        <button @click="searchMovies" class="hover:text-red-500 mb-2">
          <i class="fas fa-search"></i>
        </button>        
        <BaseInput
            v-model="searchQuery"
            @keyup.enter="searchMovies"
            type="text"
            placeholder="Kërko film..."
            style="margin-right:0;"
          />
        <BaseSelect
          id="country"
          :options="[{ name: 'Të gjitha shtetet', value: '' },...(Array.isArray(countries) ? countries : [])]"
          label-key="name"
          value-key="value"
          @update:modelValue="updateCountry"
        />

        <BaseSelect
          id="date"
          :options="[{ text: 'Te gjitha datat', value: '' }, ...dates]"
          label-key="text"
          value-key="value"
          @update:modelValue="updateDate"
        />
      </div>
    </div>
  </div>
</template>