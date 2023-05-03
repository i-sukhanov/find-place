import { defineStore } from 'pinia';

export const useApi = defineStore('api', {
  actions: {
    async request({
      path = '',
      method = 'GET',
      params,
    }: {
      path: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      params: any;
    }) {
      const request = await fetch(path, {
        method,
        body: JSON.stringify(params),
      });

      const data = await request.json();

      return data;
    },
  },
});
