// src/components/MapDashboard.tsx
import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import './MapDashboard.scss';

const MapDashboard: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: [],
  });
// to handle errors during charging
  if (loadError) return <div>Error cargando el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className={"dashboard"} style={{ padding: "1rem" }}>
      <h2>Dashboard de Mapa</h2>
      <div>Mapa</div>
    </div>
  );
};

export default MapDashboard;
