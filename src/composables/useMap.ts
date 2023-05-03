import { ref, watch } from 'vue';
import { tileLayer, map, icon, marker, popup } from 'leaflet';
import { MapClickEvent } from '@/types/Map';
import { useMapStore } from '@/store';

export const useMap = (props: { editable: boolean }) => {
  const mapEl = ref(null as typeof map);
  const mapStore = useMapStore();

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

  return {
    initMap,
    pins: mapStore.pins,
  };
};
