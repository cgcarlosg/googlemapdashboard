import { useState, useEffect } from "react";
import MapContainer from "./components/MapContainer/MapContainer";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import Header from "./components/Header/Header";
import type { PoiData, HitosData } from "./types";

const defaultCenter = { lat: 4.710989, lng: -74.07209 };
const saved = localStorage.getItem("last-center");
const initialCenter = (() => {
  if (!saved) return defaultCenter;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.warn(
      "Failed to parse 'last-center' from localStorage, using default.",
      e
    );
    return defaultCenter;
  }
})();

const App = () => {
  const [center, setCenter] = useState(initialCenter);
  const [puntosInteres, setPuntosInteres] = useState<PoiData[]>([]);
  const [hitos, setHitos] = useState<HitosData[]>([]);

  useEffect(() => {
    localStorage.setItem("last-center", JSON.stringify(center));
  }, [center]);

  return (
    <div className="app">
      <Header onLocationSelect={setCenter} />
      <MapContainer
        center={center}
        onHitosChange={setHitos}
        onPuntosInteresChange={setPuntosInteres}
      />
      <Sidebar puntosInteres={puntosInteres} hitos={hitos} />
    </div>
  );
};

export default App;
