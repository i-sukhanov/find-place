import { defineStore } from 'pinia';
import { PinCollection } from '@/types/Pin';

export const useMapStore = defineStore('map', {
  state() {
    return {
      pins: [] as PinCollection,
    };
  },
});
