export interface BusModel {
  numeroBus: string;
  chofer: string;
  modelo: string;
  anio: number;
  startLocation: {
    latitude: number;
    longitude: number;
  };
  endLocation: {
    latitude: number;
    longitude: number;
  };
}