// src/components/MapDashboard.tsx
import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import { GoogleMap } from "@react-google-maps/api";

import './MapDashboard.scss';

const center = {
  lat: 4.710989,
  lng: -74.072090,
};

const MapDashboard: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: [],
  });
// to handle errors during charging
  if (loadError) return <div>Error cargando el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className={"dashboard"}>
      <h2>Dashboard de Mapa</h2>
       <GoogleMap
        mapContainerClassName="dashboard__container"
        center={center}
        zoom={12}
      >
        {/* To Add Logic */}
      </GoogleMap>
    </div>
  );
};

export default MapDashboard;
