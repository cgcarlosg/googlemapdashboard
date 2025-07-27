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
import {
  interpolatePoints,
  generarPuntoAleatorioEnCirculo,
} from "../../utils/mapUtils";

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
