import React, { useState } from "react";
import type { MarkerData } from "../../types";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";


import "./MapContainer.scss";
import type { AppProps } from "../../types";


const MapContainer: React.FC<AppProps> = ({ center }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

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
    console.log("previo marcador:", markers);
    console.log("Nuevo marcador:", newMarker);
  };

  return (
    <div className="mapcontainer">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div className="mapcontainer__container">
          <Map
            className="mapcontainer__map"
            center={center}
            defaultZoom={12}
            mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
            onClick={handleMapClick}
            gestureHandling="greedy"
            disableDefaultUI={false}
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
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

export default MapContainer;
