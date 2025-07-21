import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import './NewMapDashboard.scss';

const center = { lat: 4.710989, lng: -74.07209 };

const NewMapDashboard: React.FC = () => {
  return (
    <div className="new-dashboard">
      <h2>Nuevo Dashboard (Google recomendado)</h2>

      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          center={center}
          zoom={12}
          className="map-container"
        />
      </APIProvider>
    </div>
  );
};

export default NewMapDashboard;
