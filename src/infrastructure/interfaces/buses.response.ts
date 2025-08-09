export interface Location {
  latitude: number;
  longitude: number;
}

export interface BusResponse {
  id: string;
  numeroBus: string;
  chofer: string;
  modelo: string;
  anio: number;
  startLocation?: Location;
  endLocation?: Location;
  imageUrl?: string;
}