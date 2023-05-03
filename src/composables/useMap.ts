import { ref } from 'vue';
import {
  tileLayer,
  map,
  // icon,
  // marker,
} from 'leaflet';
import { MapClickEvent } from '@/types/Map';

export const useMap = (props: { editable: boolean }) => {
  const mapEl = ref(null as typeof map);

  const handleMapClick = (event: MapClickEvent) => {
    console.log(event.latlng);
  };

  const initMap = (): void => {
    mapEl.value = map('map').setView([41.7151, 44.8271], 13);

    tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
    ).addTo(mapEl.value);

    // TODO: move to retrive pins method
    // const pins: PinCollection = [
    //   {
    //     id: '1',
    //     coords: [41.7151, 44.8271],
    //     name: 'Какое-то место',
    //   },
    // ];
    // pins.forEach((pin) => {
    //   const markerInstance = marker(pin.coords, {
    //     title: pin.name,
    //     icon: icon({
    //       iconUrl: 'public/icons/pin.png',
    //     }),
    //   }).addTo(mapEl.value);

    //   const popupInstance = popup(pin.coords, {
    //     content: pin.name,
    //   });

    //   markerInstance.bindPopup(popupInstance);
    // });

    if (props.editable) mapEl.value.on('click', handleMapClick);
  };

  return {
    initMap,
  };
};
