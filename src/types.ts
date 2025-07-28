export type SearchProps = {
  onLocationSelect: (coords: google.maps.LatLngLiteral) => void;
};

export type UserPath = google.maps.LatLngLiteral[];

export type MarkerData = {
  id: string;
  position: google.maps.LatLngLiteral;
};

export interface MapContainerProps {
  center: google.maps.LatLngLiteral;
  onHitosChange: (hitos: HitosData[]) => void;
  onPuntosInteresChange: (pois: PoiData[]) => void;
  onDemographicsChange: (ageData: AgeGroupData, socioData: SocioeconomicData) => void;
}

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
  pathPoints: UserPath;
  setPathPoints: React.Dispatch<React.SetStateAction<UserPath>>;
}

export interface SidebarProps { 
  puntosInteres: PoiData[];
  hitos: HitosData[];
  ageGroupData: AgeGroupData;
  socioeconomicData: SocioeconomicData; 
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
  onHitosChange: (hitos: HitosData[]) => void;
  onPuntosInteresChange: (pois: PoiData[]) => void;
  onDemographicsChange: (ageData: AgeGroupData, socioData: SocioeconomicData) => void;
  
  pathPoints: UserPath;
}