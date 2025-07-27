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

import "./MapContainer.scss";
import type { AppProps } from "../../types";

const MapContainer: React.FC<AppProps> = ({ center }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const rutaRef = useRef<google.maps.Polyline | null>(null);
  const [hitos, setHitos] = useState<google.maps.LatLngLiteral[]>([]);

  const lastCenter = useRef(center);

  function interpolatePoints(
    path: google.maps.LatLngLiteral[],
    stepMeters = 1000
  ): google.maps.LatLngLiteral[] {
    const earthRadius = 6371000; // metros

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

  return (
    <div className="mapcontainer">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div className="mapcontainer__container">
          <Map
            className="mapcontainer__map"
            defaultCenter={center}
            defaultZoom={13}
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
            {hitos.map((hito, idx) => (
              <AdvancedMarker key={`hito-${idx}`} position={hito}>
                <Pin background={"#FF0000"} />
              </AdvancedMarker>
            ))}
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

export default MapContainer;
