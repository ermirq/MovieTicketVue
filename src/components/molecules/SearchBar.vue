<script setup>
import BaseButton from '../atoms/BaseButton.vue';
import BaseInput from '../atoms/BaseInput.vue';

const props = defineProps({
  modelValue: { type: String, default: '' }
});
const emit = defineEmits(['update:modelValue', 'search']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};

const triggerSearch = () => {
  emit('search');
};
</script>

<template>
  <div class="flex justify-center w-full text-white font-bold py-3 px-4 transition duration-300">
    <div class="w-full bg-white dark:bg-gray-900 z-40 shadow-sm">
      <div class="flex justify-end mt- gap-3 max-w-7xl mx-auto">
        <div class="flex justify-center items-center space-x-2">
           <BaseButton @click="triggerSearch" class="hover:text-red-500">
              <i class="fas fa-search"></i>
            </BaseButton>
            <BaseInput
              :value="modelValue"
              @input="updateValue"
              placeholder="Kërko film..."
              @keyup.enter="triggerSearch"
              class="hover:text-red-500"
            />
        </div>
      </div>
    </div>
  </div>
</template>

 