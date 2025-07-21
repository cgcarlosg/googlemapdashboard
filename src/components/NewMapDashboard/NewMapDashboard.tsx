import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";

import "./NewMapDashboard.scss";

const center = { lat: 4.710989, lng: -74.07209 };
  type MarkerData = {
    id: string;
    position: google.maps.LatLngLiteral;
  };

const NewMapDashboard: React.FC = () => {

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
    <div className="dashboard">
      <h2>Nuevo Dashboard (Google recomendado)</h2>

      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div className="dashboard__container">
          <Map
            className="dashboard__map"
            defaultCenter={center}
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
                  setMarkers((prev) =>
                    prev.filter((m) => m.id !== marker.id)
                  );
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

export default NewMapDashboard;
