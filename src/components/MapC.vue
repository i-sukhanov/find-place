<template>
  <div id="map" class="map h-screen" />
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

const { initMap } = useMap(props);

onMounted(initMap);
</script>
