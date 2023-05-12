import { computed, ref, watch, reactive } from 'vue';
import { tileLayer, map, icon, marker, popup } from 'leaflet';
import { MapClickEvent, GeocodingResult } from '@/types/Map';
import { useMapStore } from '@/store';
import { useDebounceFn } from '@vueuse/core';
import { SavePlaceForm, Pin } from '@/types/Pin';
import { nanoid } from 'nanoid';
import config from '@/config/index.json';

export const useMap = (props: { editable: boolean } | null) => {
  const mapEl = ref(null as typeof map);
  const mapStore = useMapStore();
  const searching = ref(false);
  const showDialog = ref(false);
  const coordsToSave = ref<[number, number] | null>(null);
  const userPositionMarker = ref<typeof marker>(null);
  const form = reactive({
    name: '',
    description: '',
    address: '',
  });

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

    if (!props?.editable) {
      getLocation();

      userPositionMarker.value = marker(config.mapCenter, {
        icon: icon({
          iconUrl: config.userIcon,
          iconSize: config.iconSize,
          iconAnchor: config.iconAnchor,
        }),
      }).addTo(mapEl.value);
    }

    tileLayer(config.tileLayerLink).addTo(mapEl.value);

    mapStore.getPlaces();
  };

  const search = useDebounceFn(
    async (
      event: Event & {
        target: HTMLInputElement;
      }
    ) => {
      const value = event.target.value;

      if (value === '') {
        mapStore.resetResults();
      } else if (value.length > 3) {
        searching.value = true;

        try {
          mapStore.resetResults();
          await mapStore.getCoords(value);
        } finally {
          searching.value = false;
        }
      }
    },
    300
  );

  const handleResultClick = (result: GeocodingResult) => {
    const latlng = [Number(result.lat), Number(result.lon)];

    const markerInstance = marker(latlng, {
      title: result.display_name,
      icon: icon({
        iconUrl: result.icon ?? config.defaultIcon,
        iconSize: config.iconSize,
        iconAnchor: config.iconAnchor,
      }),
    }).addTo(mapEl.value);

    mapEl.value.flyTo(latlng, 16);

    if (props?.editable) {
      markerInstance.on('click', (event: MapClickEvent) => {
        coordsToSave.value = [event.latlng.lat, event.latlng.lng];
        form.address = result.display_name;

        showDialog.value = true;
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
              iconUrl: config.defaultIcon,
              iconSize: config.iconSize,
              iconAnchor: config.iconAnchor,
            }),
          }).addTo(mapEl.value);

          if (!props?.editable) {
            const popupInstance = popup(pin.coords, {
              content: `<b>${pin.name}</b></br><span>${pin.description}</span>`,
              offset: config.offset,
            });

            markerInstance.bindPopup(popupInstance);
          } else {
            markerInstance.on('click', () => {
              console.log(pin);
            });
          }
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
    form,
  };
};
