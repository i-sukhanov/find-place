import { defineStore } from 'pinia';
import { PinCollection } from '@/types/Pin';
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
    async addPin() {
      const api = useApi();

      await api.request({
        path: 'pins',
        body: JSON.stringify({
          id: 'string',
          coords: [1, 1],
          name: 'string',
        }),
        method: 'POST',
      });
    },
    async getCoords(query: string) {
      const api = useApi();
      const places = await api.geocodingRequest(query);
      const fitered = places.filter((p) =>
        p.display_name.toLowerCase().includes('tbilisi')
      );

      return fitered;
    },
  },
});
