<template>
  <div class="map-dialog flex justify-center items-center">
    <div class="p-4 bg-slate-50 rounded-md w-64">
      <div class="flex justify-between items-center">
        <p>{{ title }}</p>
        <button @click="closeDialog" class="p-2 text-xl">X</button>
      </div>
      <form @submit.prevent="submit">
        <fieldset class="mt-1">
          <label class="text-xs">Название</label>
          <input
            type="text"
            required
            class="p-1 text-xs w-full"
            v-model="form.name"
          />
        </fieldset>
        <fieldset class="mt-1">
          <label class="text-xs">Описание</label>
          <textarea
            v-model="form.description"
            type="text"
            class="p-1 text-xs w-full"
          />
        </fieldset>
        <fieldset class="mt-1">
          <label class="text-xs">Адрес</label>
          <input
            type="text"
            required
            class="p-1 text-xs w-full"
            v-model="form.address"
          />
        </fieldset>
        <button
          type="submit"
          class="w-full py-2 mt-4 text-xs bg-cyan-800 text-slate-50 rounded-sm"
        >
          Сохранить
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useMap } from '@/composables/useMap';

defineProps({
  title: {
    type: String,
    default: 'Добавление места',
  },
});

const { form } = useMap(null);

const emits = defineEmits(['modal:save', 'modal:close']);

const submit = () => {
  emits('modal:save', form);
};

const closeDialog = () => {
  emits('modal:close');
};
</script>
