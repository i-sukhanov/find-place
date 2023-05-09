<template>
  <div class="relative map">
    <div id="map" class="map h-screen relative z-10" />
    <div
      v-if="editable"
      class="absolute top-2 right-2 z-50 bg-transparent w-80"
    >
      <input
        class="pl-2 py-1 w-full border outline-none map__search-field text-sm"
        :class="[showResults ? 'rounded-t-md' : 'rounded-md']"
        @input="search"
        type="search"
        placeholder="Поиск места"
      />
      <template v-if="showResults">
        <div
          v-for="result in results"
          :key="result.place_id"
          class="pl-2 py-1 bg-white border-b border-x cursor-pointer hover:bg-slate-100 truncate last:rounded-b-md map__results invisible from-neutral-400 text-sm"
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
    <MapDialog
      v-if="showDialog && editable"
      @modal:close="showDialog = false"
      @modal:submit="savePlace"
      class="absolute top-0 bottom-0 left-0 right-0 z-50"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, defineProps, computed } from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMap } from '@/composables/useMap';
import MapDialog from '@/components/MapDialog.vue';

const props = defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
});

const {
  initMap,
  search,
  results,
  searching,
  handleResultClick,
  showDialog,
  savePlace,
} = useMap(props);

const showResults = computed(() => results.value.length && !searching.value);

onMounted(initMap);
</script>

<style scoped>
.map__search-field:focus ~ .map__results {
  visibility: visible;
}
</style>
