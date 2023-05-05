export type Pin = {
  id: string;
  coords: [number, number];
  name: string;
  description?: string;
  tags?: string[];
};

export type SavePlaceForm = {
  name: string;
  description?: string;
};

export type PinCollection = Pin[];
