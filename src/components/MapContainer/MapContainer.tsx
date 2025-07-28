/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import type {
  PoiData,
  MapContainerProps,
  AgeGroupData,
  SocioeconomicData,
} from "../../types";
  import {
  APIProvider,
  Map,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import MapControls from "./MapControls";
import MapMarkers from "./MapMarkers";

import "./MapContainer.scss";
import {
  interpolatePoints,
  generarPuntoAleatorioEnCirculo,
} from "../../utils/mapUtils";

const MapContainer: React.FC<MapContainerProps> = ({
  center,
  onHitosChange,
  onPuntosInteresChange,
  onDemographicsChange,
  pathPoints,
  setPathPoints,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const rutaRef = useRef<google.maps.Polyline | null>(null);
  const [hitos, setHitos] = useState<google.maps.LatLngLiteral[]>([]);
  const [puntosInteres, setPuntosInteres] = useState<
    { position: google.maps.LatLngLiteral; tipo: string }[]
  >([]);
  const lastCenter = useRef(center);
  const circulosRef = useRef<google.maps.Circle[]>([]);
  const [mostrarHitos, setMostrarHitos] = useState(true);
  const [mostrarCirculos, setMostrarCirculos] = useState(true);
  const [mostrarPuntosInteres, setMostrarPuntosInteres] = useState(true);
  const [hitoActivo, setHitoActivo] = useState<number | null>(null);

  useEffect(() => {
    if (mapRef.current && pathPoints.length === 2) {
      if (rutaRef.current) {
        rutaRef.current.setMap(null);
      }
      rutaRef.current = new google.maps.Polyline({
        path: pathPoints,
        map: mapRef.current,
        strokeColor: "#0000FF",
        strokeOpacity: 1.0,
        strokeWeight: 4,
      });

      const puntos = interpolatePoints(pathPoints, 1000);
      setHitos(puntos);
      onHitosChange(puntos);

      const tipos = ["Parque", "Restaurante", "Tienda"];
      const nuevosPOI: PoiData[] = [];
      puntos.forEach((punto) => {
        for (let i = 0; i < 2; i++) {
          const pos = generarPuntoAleatorioEnCirculo(punto, 450);
          const tipo = tipos[Math.floor(Math.random() * tipos.length)];
          nuevosPOI.push({ position: pos, tipo });
        }
      });
      setPuntosInteres(nuevosPOI);
      onPuntosInteresChange(nuevosPOI);

      const newAgeData: AgeGroupData = [
        { name: '0-17 años', value: Math.floor(Math.random() * 100) + 20, color: '#8884d8' },
        { name: '18-35 años', value: Math.floor(Math.random() * 100) + 80, color: '#82ca9d' },
        { name: '36-55 años', value: Math.floor(Math.random() * 100) + 50, color: '#ffc658' },
        { name: '56+ años', value: Math.floor(Math.random() * 50) + 10, color: '#ff7300' },
      ];
      const newSocioData: SocioeconomicData = [
        { name: 'Clase A', value: Math.floor(Math.random() * 30) + 10, color: '#0088FE' },
        { name: 'Clase B', value: Math.floor(Math.random() * 60) + 30, color: '#00C49F' },
        { name: 'Clase C', value: Math.floor(Math.random() * 80) + 50, color: '#FFBB28' },
        { name: 'Clase D', value: Math.floor(Math.random() * 40) + 20, color: '#FF8042' },
        { name: 'Clase E', value: Math.floor(Math.random() * 20) + 5, color: '#AF19FF' },
      ];
      onDemographicsChange(newAgeData, newSocioData);
    }
  }, [pathPoints, mapRef, onHitosChange, onPuntosInteresChange, onDemographicsChange]); 


  useEffect(() => {
    if (!mapRef.current) return;
    
    circulosRef.current.forEach((c) => c.setMap(null));
    circulosRef.current = [];

    if (mostrarCirculos && hitos.length > 0) {
      hitos.forEach((punto) => {
        const circulo = new google.maps.Circle({
          map: mapRef.current!,
          center: punto,
          radius: 450,
          strokeColor: "#ff008cff",
          strokeOpacity: 0.6,
          strokeWeight: 1,
          fillColor: "#ff008cff",
          fillOpacity: 0.2,
        });
        circulosRef.current.push(circulo);
      });
    }
  }, [hitos, mostrarCirculos]);


  useEffect(() => {
    if (
      mapRef.current &&
      (center.lat !== lastCenter.current.lat ||
        center.lng !== lastCenter.current.lng)
    ) {
      mapRef.current.panTo(center);
      lastCenter.current = center;
    }
  }, [center]);

    const handleMapClick = (event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;
    if (pathPoints.length < 2) {
      setPathPoints((prev: any) => [...prev, { lat: latLng.lat, lng: latLng.lng }]);
    } else {
      setPathPoints([{ lat: latLng.lat, lng: latLng.lng }]);
    }
  };

  return (
    <div className="mapcontainer">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div className="mapcontainer__container">
          <MapControls
            mostrarHitos={mostrarHitos}
            setMostrarHitos={setMostrarHitos}
            mostrarCirculos={mostrarCirculos}
            setMostrarCirculos={setMostrarCirculos}
            mostrarPuntosInteres={mostrarPuntosInteres}
            setMostrarPuntosInteres={setMostrarPuntosInteres}
          />

          <Map
            className="mapcontainer__map"
            defaultCenter={center}
            defaultZoom={14}
            mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
            onClick={handleMapClick}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onIdle={(ev) => {
              if (!mapRef.current) {
                mapRef.current = ev.map;
              }
            }}
          >
            <MapMarkers
              hitos={hitos}
              mostrarHitos={mostrarHitos}
              puntosInteres={puntosInteres}
              mostrarPuntosInteres={mostrarPuntosInteres}
              hitoActivo={hitoActivo}
              setHitoActivo={setHitoActivo}
              pathPoints={pathPoints}
              setPathPoints={setPathPoints}
            />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

export default MapContainer;
