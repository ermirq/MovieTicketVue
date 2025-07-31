<script setup>
import { ref } from 'vue'
import EyeIcon from '../atoms/EyeIcon.vue'
import BaseInput from '../atoms/BaseInput.vue'

defineProps({
  modelValue: String,
  id: String,
  label: String,
  placeholder: String,
  type: {
    type: Text,
    default: 'password'
  }
})
const emit = defineEmits(['update:modelValue'])

const passwordFieldType = ref('password')

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};
</script>

<template>
  <div class="relative">
   <label :for="id" class="text-sm font-medium ml-2 text-gray-300">{{ label }}</label>
    <input :type="passwordFieldType" :placeholder="placeholder" :id="id"
      class="w-full mt-2 px-4 py-2 pr-10 rounded-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
      :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />

    <EyeIcon :passwordFieldType="passwordFieldType"
        @toggleVisibility="togglePasswordVisibility"
        class="absolute right-4 top-10.5 "/>
  </div>
</template>


