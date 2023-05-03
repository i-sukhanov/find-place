import { defineStore } from 'pinia';
import { PinCollection } from '@/types/Pin';
import { useApi } from './api';

export const useMapStore = defineStore('map', {
  state() {
    return {
      pins: [] as PinCollection,
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
  },
});
