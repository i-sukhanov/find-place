<template>
  <div class="map-dialog flex justify-center items-center">
    <div class="p-4 bg-slate-50 rounded-md w-64">
      <div class="flex justify-between items-center">
        <p>Добавление места</p>
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
import { defineProps, reactive, defineEmits, PropType } from 'vue';

const props = defineProps({
  name: {
    type: String as PropType<string>,
    requred: true,
  },
});

const emits = defineEmits(['modal:submit', 'modal:close']);

const form = reactive({
  name: props.name,
  description: '',
});

const submit = () => {
  emits('modal:submit', form);
};

const closeDialog = () => {
  emits('modal:close');
};
</script>
