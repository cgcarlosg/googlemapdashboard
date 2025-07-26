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