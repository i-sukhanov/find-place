<template>
  <div class="relative map">
    <div id="map" class="map h-screen relative z-10" />
    <div class="absolute top-2 right-2 z-50 bg-transparent w-80">
      <input
        class="pl-2 py-1 w-full border outline-none map__search-field"
        :class="[showResults ? 'rounded-t-md' : 'rounded-md']"
        @input="search"
        type="search"
        placeholder="Поиск места"
      />
      <template v-if="showResults">
        <div
          v-for="result in results"
          :key="result.place_id"
          class="pl-2 py-1 bg-white border-b border-x cursor-pointer hover:bg-slate-100 truncate last:rounded-b-md map__results invisible from-neutral-400"
          @click="handleResultClick(result)"
        >
          {{ result.display_name }}
        </div>
      </template>
      <div
        v-else-if="searching"
        class="pl-2 py-1 bg-white border cursor-pointer hover:bg-slate-100 text-center"
      >
        Ищем...
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, defineProps, computed } from 'vue';
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

const showResults = computed(() => results.value.length && !searching.value);

onMounted(initMap);
</script>

<style scoped>
.map__search-field:focus ~ .map__results {
  visibility: visible;
}
</style>
