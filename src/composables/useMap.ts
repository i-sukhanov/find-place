import { computed, ref, watch } from 'vue';
import { tileLayer, map, icon, marker, popup } from 'leaflet';
import { MapClickEvent, GeocodingResult } from '@/types/Map';
import { useMapStore } from '@/store';
import { useDebounceFn } from '@vueuse/core';
import { SavePlaceForm, Pin } from '@/types/Pin';
import { nanoid } from 'nanoid';

const defaultIcon =
  'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png';
const mapCenter = [41.7151, 44.8271];

export const useMap = (props: { editable: boolean } | null) => {
  const mapEl = ref(null as typeof map);
  const mapStore = useMapStore();
  const searching = ref(false);
  const showDialog = ref(false);
  const coordsToSave = ref<[number, number] | null>(null);
  const userPositionMarker = ref<typeof marker>(null);

  const results = computed(() => mapStore.results);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((data) => {
        userPositionMarker.value.setLatLng([
          data.coords.latitude,
          data.coords.longitude,
        ]);
      });
    } else {
      console.error('Не удалось определить геолокацию');
    }
  };

  const initMap = (): void => {
    mapEl.value = map('map').setView([41.7151, 44.8271], 13);

    userPositionMarker.value = marker(mapCenter, {
      icon: icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/106/106438.png',
        iconSize: [28, 28],
        iconAnchor: [17, 17],
      }),
    }).addTo(mapEl.value);

    tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
    ).addTo(mapEl.value);

    mapStore.getPlaces();
    getLocation();
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
    const latlng = [Number(result.lat), Number(result.lon)];

    const markerInstance = marker(latlng, {
      title: result.display_name,
      icon: icon({
        iconUrl: result.icon ?? defaultIcon,
        iconSize: [28, 28],
        iconAnchor: [17, 17],
      }),
    }).addTo(mapEl.value);

    mapEl.value.flyTo(latlng, 16);

    if (props?.editable) {
      markerInstance.on('click', (event: MapClickEvent) => {
        showDialog.value = true;
        coordsToSave.value = [event.latlng.lat, event.latlng.lng];
      });
    } else {
      markerInstance.bindPopup(
        popup(latlng, {
          content: result.display_name,
        })
      );
    }
  };

  const savePlace = async (place: SavePlaceForm) => {
    try {
      const placeDTO: Pin = {
        id: nanoid(),
        name: place.name,
        description: place.description,
        coords: coordsToSave.value ?? [1, 1],
      };

      await mapStore.addPlace(placeDTO);
    } finally {
      showDialog.value = false;
    }
  };

  watch(
    computed(() => mapStore.pins),
    (value) => {
      if (value.length) {
        value.forEach((pin) => {
          const markerInstance = marker(pin.coords, {
            title: pin.name,
            icon: icon({
              iconUrl: defaultIcon,
              iconSize: [28, 28],
              iconAnchor: [17, 17],
            }),
          }).addTo(mapEl.value);

          const popupInstance = popup(pin.coords, {
            content: pin.description,
          });

          markerInstance.bindPopup(popupInstance);
        });
      }
    },
    {
      deep: true,
    }
  );

  return {
    initMap,
    search,
    handleResultClick,
    savePlace,
    results,
    searching,
    showDialog,
  };
};
