export type MapClickEvent = {
  containerPoint: { x: number; y: number };
  latlng: { lat: number; lng: number };
  layerPoint: { x: number; y: number };
};

export type GeocodingResult = {
  latitude: number;
  longitude: number;
  name: string;
  number: null;
  postal_code: number;
  street: string | null;
  region: string;
  region_code: string;
  locality: string;
  country: string;
  country_code: string;
  label: string;
};

export type GeocodingResultCollection = GeocodingResult[];
