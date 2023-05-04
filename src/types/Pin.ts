export type Pin = {
  id: string;
  coords: [number, number];
  name: string;
  description?: string;
  tags?: string[];
  icon: string;
};

export type PinCollection = Pin[];
