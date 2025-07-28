 
import React, { useState, useEffect, useRef } from "react";
import type {
  MapContainerProps,
  UserPath,
} from "../../types";
import {
  APIProvider,
  Map,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import MapControls from "./MapControls";
import MapMarkers from "./MapMarkers";
import "./MapContainer.scss";

const MapContainer: React.FC<MapContainerProps & { setPathPoints: React.Dispatch<React.SetStateAction<UserPath>> }> = ({
  center,
  hitos,
  puntosInteres,
  pathPoints,
  setPathPoints,
  onClearData,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const rutaRef = useRef<google.maps.Polyline | null>(null);
  const circulosRef = useRef<google.maps.Circle[]>([]);

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
      setHitoActivo(null); 
      return;
    }

 if (isMapReady && mapRef.current) {
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
            onClearData={onClearData}
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