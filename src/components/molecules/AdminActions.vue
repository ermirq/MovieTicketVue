<script setup>
import BaseButton from '../atoms/BaseButton.vue';
defineEmits(['edit', 'delete']);
const props = defineProps({
  iconOnly: { type: Boolean, default: false }
});

</script>

<template>
  <div class="flex justify-center space-x-2">
    <BaseButton
      class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full transition-colors duration-200"
      @click="$emit('edit')">
      <div class="flex items-center justify-center gap-1 px-2 py-1">
        <i class="fas fa-edit"></i>
          <span v-if="!iconOnly">Përditëso</span>
      </div>
    </BaseButton>

    <BaseButton
      class="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full transition-colors duration-200"
      @click="$emit('delete')">
      <div class="flex items-center justify-center gap-1 px-2 py-1">
        <i class="fas fa-trash-alt"></i>
          <span v-if="!iconOnly">Fshi</span>
      </div>
    </BaseButton>
  </div>
</template>
