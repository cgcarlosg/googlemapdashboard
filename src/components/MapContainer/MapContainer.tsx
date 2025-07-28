/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import type {
  PoiData,
  MapContainerProps,
  AgeGroupData,
  SocioeconomicData,
  UserPath,
} from "../../types";
import {
  APIProvider,
  Map,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import MapControls from "./MapControls";
import MapMarkers from "./MapMarkers";
import useLocalStorage from "../../hooks/useLocalStorage";

import "./MapContainer.scss";
import {
  interpolatePoints,
  generarPuntoAleatorioEnCirculo,
} from "../../utils/mapUtils";

const MapContainer: React.FC<MapContainerProps & { setPathPoints: React.Dispatch<React.SetStateAction<UserPath>> }> = ({
  center,
  onHitosChange,
  onPuntosInteresChange,
  onDemographicsChange,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const rutaRef = useRef<google.maps.Polyline | null>(null);
  const circulosRef = useRef<google.maps.Circle[]>([]);

  const [pathPoints, setPathPoints] = useLocalStorage<UserPath>("mapPathPoints", []);
  const [hitos, setHitos] = useLocalStorage<google.maps.LatLngLiteral[]>("mapHitos", []);
  const [puntosInteres, setPuntosInteres] = useLocalStorage<
    { position: google.maps.LatLngLiteral; tipo: string }[]
  >("mapPuntosInteres", []);
  const [ageData, setAgeData] = useLocalStorage<AgeGroupData>("mapAgeData", []);
  const [socioData, setSocioData] = useLocalStorage<SocioeconomicData>("mapSocioData", []);

  const lastCenter = useRef(center);
  const [mostrarHitos, setMostrarHitos] = useState(true);
  const [mostrarCirculos, setMostrarCirculos] = useState(true);
  const [mostrarPuntosInteres, setMostrarPuntosInteres] = useState(true);
  const [hitoActivo, setHitoActivo] = useState<number | null>(null);

  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (pathPoints.length < 2) {
      if (rutaRef.current) {
        rutaRef.current.setMap(null);
        rutaRef.current = null;
      }
      circulosRef.current.forEach((c) => c.setMap(null));
      circulosRef.current = [];

      setHitos([]);
      onHitosChange([]);
      setPuntosInteres([]);
      onPuntosInteresChange([]);
      setAgeData([]);
      setSocioData([]);
      onDemographicsChange([], []);
      return;
    }

    if (pathPoints.length === 2 && hitos.length > 0 && puntosInteres.length > 0 && ageData.length > 0 && socioData.length > 0) {
      onHitosChange(hitos);
      onPuntosInteresChange(puntosInteres);
      onDemographicsChange(ageData, socioData);
      return;
    }
    const interpolatedPoints = interpolatePoints(pathPoints, 1000);
    const allHitos: google.maps.LatLngLiteral[] = [];
    if (pathPoints[0]) allHitos.push(pathPoints[0]);
    interpolatedPoints.forEach(p => {
      if (!(p.lat === pathPoints[0].lat && p.lng === pathPoints[0].lng)) {
        allHitos.push(p);
      }
    });
    if (pathPoints[1] && !(allHitos[allHitos.length - 1].lat === pathPoints[1].lat && allHitos[allHitos.length - 1].lng === pathPoints[1].lng)) {
      allHitos.push(pathPoints[1]);
    }
    setHitos(allHitos);
    onHitosChange(allHitos);

    const tipos = ["Parque", "Restaurante", "Tienda"];
    const nuevosPOI: PoiData[] = [];
    allHitos.forEach((punto) => {
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
    setAgeData(newAgeData);
    setSocioData(newSocioData);
    onDemographicsChange(newAgeData, newSocioData);
  }, [pathPoints, onHitosChange, onPuntosInteresChange, onDemographicsChange, hitos, puntosInteres, ageData, socioData]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) {
      if (rutaRef.current) {
        rutaRef.current.setMap(null);
        rutaRef.current = null;
      }
      circulosRef.current.forEach((c) => c.setMap(null));
      circulosRef.current = [];
      return;
    }

    if (pathPoints.length === 2) {
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
    } else {
      if (rutaRef.current) {
        rutaRef.current.setMap(null);
        rutaRef.current = null;
      }
    }

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
  }, [isMapReady, pathPoints, hitos, mostrarCirculos]);

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
      setPathPoints((prev) => [...prev, { lat: latLng.lat, lng: latLng.lng }]);
    } else {
      setHitoActivo(null);
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
            defaultZoom={13}
            mapId={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onClick={handleMapClick}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onIdle={(ev) => {
              if (!mapRef.current) {
                mapRef.current = ev.map;
                setIsMapReady(true);
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