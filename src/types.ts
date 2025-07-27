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