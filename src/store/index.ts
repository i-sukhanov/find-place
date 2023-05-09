import { defineStore } from 'pinia';
import { PinCollection, Pin } from '@/types/Pin';
import { GeocodingResultCollection } from '@/types/Map';
import { useApi } from '@/store/api';

export const useMapStore = defineStore('map', {
  state() {
    return {
      pins: [] as PinCollection,
      results: [] as GeocodingResultCollection,
    };
  },
  actions: {
    async addPlace(place: Pin) {
      const api = useApi();

      await api.request({
        path: 'pins',
        body: JSON.stringify({
          id: place.id,
          coords: place.coords,
          name: place.name,
          description: place.description,
        }),
        method: 'POST',
      });
    },
    async getPlaces() {
      const api = useApi();

      const pins = await api.request({
        path: 'pins',
        method: 'GET',
      });

      this.pins = Object.values(pins);
    },
    async getCoords(query: string) {
      const api = useApi();
      const places = await api.geocodingRequest(query);
      const fitered = places?.filter((p) =>
        p.display_name.toLowerCase().includes('tbilisi')
      );

      this.results = fitered;
    },
    resetResults() {
      this.results = [];
    },
  },
});
