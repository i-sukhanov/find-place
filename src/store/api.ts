import { defineStore } from 'pinia';
import { GeocodingResultCollection } from '@/types/Map';

const geoCodingApi = process.env.VUE_APP_GEOCODING_API_URL;

export const makeURL = (
  path: string,
  query: Record<string, string>
): string => {
  const url = new URL(`${process.env.VUE_APP_API_URL}/${path}.json`);
  if (url.pathname.endsWith('/')) {
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);
  }
  url.search = new URLSearchParams(query).toString();
  return url.toString();
};

export const useApi = defineStore('api', {
  actions: {
    async request({ path = '', method = 'GET', body = null, query = {} }: any) {
      const request = await fetch(makeURL(path, query), {
        method,
        body,
      });

      const data = await request.json();

      return data;
    },
    async geocodingRequest(query: string): Promise<GeocodingResultCollection> {
      const request = await fetch(`${geoCodingApi}&q=${query}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          origin: '*',
        },
      });

      const data = await request.json();

      return await data;
    },
  },
});
