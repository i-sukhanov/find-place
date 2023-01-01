<template>
  <div id="map" class="map h-screen" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PinCollection } from '@/types/Pin';

const map = ref(null);

const pins: PinCollection = [
  {
    id: '1',
    coords: [41.7151, 44.8271],
    name: 'Какое-то место',
  },
];

const initMap = () => {
  map.value = L.map('map').setView([41.7151, 44.8271], 13);

  L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
  ).addTo(map.value);
};

onMounted(() => {
  initMap();

  pins.forEach((pin) => {
    const marker = L.marker(pin.coords, {
      title: pin.name,
    }).addTo(map.value);

    const popup = L.popup(pin.coords, {
      content: pin.name,
    });

    marker.bindPopup(popup);
  });
});
</script>

<style scoped></style>
