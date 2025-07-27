import React, { useState, useEffect, useRef } from "react";
import type { MarkerData } from "../../types";
import { mockLocations } from "../../data/MockLocations";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import MapControls from "./MapControls";
import "./MapContainer.scss";
import type { AppProps } from "../../types";

const MapContainer: React.FC<AppProps> = ({ center }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
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

  function interpolatePoints(
    path: google.maps.LatLngLiteral[],
    stepMeters = 1000
  ): google.maps.LatLngLiteral[] {
    const earthRadius = 6371000;

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const result: google.maps.LatLngLiteral[] = [];

    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];

      const lat1 = toRad(p1.lat);
      const lon1 = toRad(p1.lng);
      const lat2 = toRad(p2.lat);
      const lon2 = toRad(p2.lng);

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;

      const steps = Math.floor(distance / stepMeters);

      for (let j = 1; j <= steps; j++) {
        const f = j / steps;

        const lat = p1.lat + (p2.lat - p1.lat) * f;
        const lng = p1.lng + (p2.lng - p1.lng) * f;

        result.push({ lat, lng });
      }
    }

    return result;
  }

  function generarPuntoAleatorioEnCirculo(
    centro: google.maps.LatLngLiteral,
    radioMetros: number
  ): google.maps.LatLngLiteral {
    const y = Math.random();
    const x = Math.random();

    const distancia = radioMetros * Math.sqrt(x);
    const angulo = 2 * Math.PI * y;

    const deltaLat = (distancia * Math.cos(angulo)) / 111320;
    const deltaLng =
      (distancia * Math.sin(angulo)) /
      (111320 * Math.cos((centro.lat * Math.PI) / 180));

    return {
      lat: centro.lat + deltaLat,
      lng: centro.lng + deltaLng,
    };
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current && !rutaRef.current) {
        const path = mockLocations.map((loc) => loc.coords);
        rutaRef.current = new google.maps.Polyline({
          path,
          map: mapRef.current,
          strokeColor: "#0000FF",
          strokeOpacity: 1.0,
          strokeWeight: 4,
        });

        const puntos = interpolatePoints(path, 1000);
        setHitos(puntos);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

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

    const newMarker: MarkerData = {
      id: crypto.randomUUID(),
      position: {
        lat: latLng.lat,
        lng: latLng.lng,
      },
    };

    setMarkers((prev) => [...prev, newMarker]);
  };

  useEffect(() => {
    const tipos = ["Parque", "Restaurante", "Tienda"];
    const nuevosPOI: { position: google.maps.LatLngLiteral; tipo: string }[] =
      [];

    if (!mapRef.current || hitos.length === 0) return;

    circulosRef.current.forEach((c) => c.setMap(null));
    circulosRef.current = [];

    if (mostrarCirculos) {
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

    hitos.forEach((punto) => {
      for (let i = 0; i < 2; i++) {
        const pos = generarPuntoAleatorioEnCirculo(punto, 450);
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        nuevosPOI.push({ position: pos, tipo });
      }

      setPuntosInteres(nuevosPOI);
    });
  }, [hitos, mostrarCirculos]);

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
            {markers.map((marker) => (
              <AdvancedMarker
                key={marker.id}
                position={marker.position}
                title={`Marcador en: ${marker.position.lat.toFixed(
                  4
                )},  ${marker.position.lng.toFixed(4)}`}
                onClick={() => {
                  setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
                }}
              >
                <Pin />
              </AdvancedMarker>
            ))}
            {mostrarHitos &&
              hitos.map((hito, idx) => (
                <AdvancedMarker key={`hito-${idx}`} position={hito}>
                  <Pin background={"#FF0000"} />
                </AdvancedMarker>
              ))}
            {mostrarPuntosInteres &&
              puntosInteres.map((poi, idx) => (
                <AdvancedMarker
                  key={`poi-${idx}`}
                  position={poi.position}
                  title={`${poi.tipo}`}
                >
                  <Pin background={"#000000"} glyphColor={"#FFFFFF"} />
                </AdvancedMarker>
              ))}
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

export default MapContainer;
