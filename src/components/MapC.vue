<template>
  <div class="relative">
    <div id="map" class="map h-screen relative z-10" />
    <div class="absolute top-2 right-2 z-50 bg-transparent w-80">
      <input
        class="pl-2 py-1 w-full border border-b-0 outline-none"
        :class="[!results.length && !searching ? 'rounded-md' : 'rounded-t-md']"
        @input="search"
        type="search"
        placeholder="Поиск места"
      />
      <div
        v-if="searching"
        class="pl-2 py-1 bg-white border cursor-pointer hover:bg-slate-100 text-center"
      >
        Ищем...
      </div>
      <div
        v-for="result in results"
        :key="result.name"
        class="pl-2 py-1 bg-white border cursor-pointer hover:bg-slate-100 truncate last:rounded-b-md"
        @click="handleResultClick(result)"
      >
        {{ result.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, defineProps } from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMap } from '@/composables/useMap';

const props = defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
});

const { initMap, search, results, searching, handleResultClick } =
  useMap(props);

onMounted(initMap);
</script>
