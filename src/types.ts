export type SearchProps = {
  onLocationSelect: (coords: google.maps.LatLngLiteral) => void;
  onNewRouteStart: (coords: google.maps.LatLngLiteral) => void; 
};

export type UserPath = google.maps.LatLngLiteral[];

export type MarkerData = {
  id: string;
  position: google.maps.LatLngLiteral;
};

export interface MapControlsProps {
  mostrarHitos: boolean;
  setMostrarHitos: (value: boolean) => void;
  mostrarCirculos: boolean;
  setMostrarCirculos: (value: boolean) => void;
  mostrarPuntosInteres: boolean;
  setMostrarPuntosInteres: (value: boolean) => void;
  onClearData: () => void;
}

export interface MarkerProps {
  hitos: google.maps.LatLngLiteral[];
  mostrarHitos: boolean;
  puntosInteres: { position: google.maps.LatLngLiteral; tipo: string }[];
  mostrarPuntosInteres: boolean;
  hitoActivo: number | null;
  setHitoActivo: React.Dispatch<React.SetStateAction<number | null>>;
  pathPoints: UserPath;
  setPathPoints: React.Dispatch<React.SetStateAction<UserPath>>;
}

export interface SidebarProps {
  puntosInteres: PoiData[];
  hitos: HitosData[];
  ageGroupData: AgeGroupData;
  socioeconomicData: SocioeconomicData;
  mostrarHitos: boolean;
  mostrarPuntosInteres: boolean;
  mostrarCirculos: boolean;
}

export type PoiData = { position: google.maps.LatLngLiteral; tipo: string };

export type HitosData = google.maps.LatLngLiteral;

export type AgeGroupData = {
  name: string;
  value: number;
  color: string;
}[];

export type SocioeconomicData = {
  name: string;
  value: number;
  color: string;
}[];

export interface MapContainerProps {
  center: google.maps.LatLngLiteral;
  hitos: HitosData[];
  puntosInteres: PoiData[];
  ageData: AgeGroupData;
  socioData: SocioeconomicData;
  pathPoints: UserPath;
  setPathPoints: React.Dispatch<React.SetStateAction<UserPath>>;
  onClearData: () => void;
  mostrarHitos: boolean;
  setMostrarHitos: React.Dispatch<React.SetStateAction<boolean>>;
  mostrarCirculos: boolean;
  setMostrarCirculos: React.Dispatch<React.SetStateAction<boolean>>;
  mostrarPuntosInteres: boolean;
  setMostrarPuntosInteres: React.Dispatch<React.SetStateAction<boolean>>;
}

