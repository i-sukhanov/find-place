import { computed, ref, watch } from 'vue';
import { tileLayer, map, icon, marker, popup } from 'leaflet';
import { MapClickEvent } from '@/types/Map';
import { useMapStore } from '@/store';
import { useDebounceFn } from '@vueuse/core';
import { GeocodingResult } from '@/types/Map';

export const useMap = (props: { editable: boolean }) => {
  const mapEl = ref(null as typeof map);
  const mapStore = useMapStore();
  const searching = ref(false);

  const handleMapClick = (event: MapClickEvent) => {
    console.log(event.latlng);
  };

  const initMap = (): void => {
    mapEl.value = map('map').setView([41.7151, 44.8271], 13);

    tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
    ).addTo(mapEl.value);

    if (props.editable) mapEl.value.on('click', handleMapClick);
  };

  const search = useDebounceFn(async (event: any) => {
    if (event.target.value === '') {
      mapStore.results = [];
    } else if (event.target.value.length > 3) {
      searching.value = true;

      try {
        mapStore.results = [];
        const results = await mapStore.getCoords(event.target.value);

        mapStore.results = results;
      } finally {
        searching.value = false;
      }
    }
  }, 500);

  const handleResultClick = (result: GeocodingResult) => {
    const latlng = [result.latitude, result.longitude];

    const markerInstance = marker(latlng, {
      title: result.name,
      icon: icon({
        iconUrl:
          'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png',
        iconSize: [28, 28],
        iconAnchor: [17, 17],
      }),
    }).addTo(mapEl.value);

    mapEl.value.flyTo(latlng, 18);

    const popupInstance = popup(latlng, {
      content: result.label,
    });

    markerInstance.bindPopup(popupInstance);
  };

  watch(mapStore.pins, (value) => {
    if (value.length) {
      value.forEach((pin) => {
        const markerInstance = marker(pin.coords, {
          title: pin.name,
          icon: icon({
            iconUrl: 'public/icons/pin.png',
          }),
        }).addTo(mapEl.value);

        const popupInstance = popup(pin.coords, {
          content: pin.name,
        });

        markerInstance.bindPopup(popupInstance);
      });
    }
  });

  const results = computed(() => mapStore.results);

  return {
    initMap,
    search,
    handleResultClick,
    results,
    searching,
  };
};
