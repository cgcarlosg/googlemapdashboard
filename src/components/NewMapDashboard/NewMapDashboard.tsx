import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';

import './NewMapDashboard.scss';

const center = { lat: 4.710989, lng: -74.07209 };

const NewMapDashboard: React.FC = () => {
 const [markers, setMarkers] = useState<Array<google.maps.LatLngLiteral>>([]);
  

const handleMapClick = (event: MapMouseEvent) => {
  const latLng = event.detail.latLng;

  if (!latLng) return; 
  const newMarker = {
    lat: latLng.lat,
    lng: latLng.lng,
  };

  setMarkers((prev) => [...prev, newMarker]);
  console.log('previo marcador:', markers);
  console.log('Nuevo marcador:', newMarker);
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
            {markers.map((marker, index) => (
              <AdvancedMarker key={index} position={marker}>
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
