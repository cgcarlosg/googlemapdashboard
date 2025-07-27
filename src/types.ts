export type SearchProps = {
  onLocationSelect: (coords: google.maps.LatLngLiteral) => void;
};

export type MarkerData = {
  id: string;
  position: google.maps.LatLngLiteral;
};

export type AppProps = {
  center: google.maps.LatLngLiteral;
};

export interface MapControlsProps {
  mostrarHitos: boolean;
  setMostrarHitos: (value: boolean) => void;
  mostrarCirculos: boolean;
  setMostrarCirculos: (value: boolean) => void;
  mostrarPuntosInteres: boolean;
  setMostrarPuntosInteres: (value: boolean) => void;
}

export interface MarkerProps {
  markers: MarkerData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>;
  hitos: google.maps.LatLngLiteral[];
  mostrarHitos: boolean;
  puntosInteres: { position: google.maps.LatLngLiteral; tipo: string }[];
  mostrarPuntosInteres: boolean;
  hitoActivo: number | null;
  setHitoActivo: React.Dispatch<React.SetStateAction<number | null>>; 
}