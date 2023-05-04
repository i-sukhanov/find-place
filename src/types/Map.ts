export type MapClickEvent = {
  containerPoint: { x: number; y: number };
  latlng: { lat: number; lng: number };
  layerPoint: { x: number; y: number };
};

export type GeocodingResult = {
  place_id: string;
  osm_type: string;
  osm_id: string;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon: string | null;
};

export type GeocodingResultCollection = GeocodingResult[];
