import { useState, useEffect, useCallback } from "react";
import MapContainer from "./components/MapContainer/MapContainer";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import Header from "./components/Header/Header";
import type { PoiData, HitosData, AgeGroupData, SocioeconomicData } from "./types";
import useLocalStorage from "./hooks/useLocalStorage";

const defaultCenter = { lat: 4.710989, lng: -74.07209 };

const App = () => {
  const [center, setCenter] = useLocalStorage("last-center", defaultCenter);
  const [puntosInteres, setPuntosInteres] = useState<PoiData[]>([]);
  const [hitos, setHitos] = useState<HitosData[]>([]);
   const [ageGroupData, setAgeGroupData] = useState<AgeGroupData>([]);
  const [socioeconomicData, setSocioeconomicData] = useState<SocioeconomicData>([]);

  useEffect(() => {
    localStorage.setItem("last-center", JSON.stringify(center));
  }, [center]);

    const handlePuntosInteresChange = useCallback((pois: PoiData[]) => {
    setPuntosInteres(pois);
  }, []);

    const handleHitosChange = useCallback((newHitos: HitosData[]) => {
    setHitos(newHitos);
  }, []);

  const handleDemographicsChange = useCallback((ageData: AgeGroupData, socioData: SocioeconomicData) => {
    setAgeGroupData(ageData);
    setSocioeconomicData(socioData);
  }, []);

  return (
    <div className="app">
      <Header onLocationSelect={setCenter} />
      <MapContainer
        center={center}
        onHitosChange={handleHitosChange}
        onPuntosInteresChange={handlePuntosInteresChange}
        onDemographicsChange={handleDemographicsChange} 
      />
      <Sidebar 
      puntosInteres={puntosInteres} 
      hitos={hitos}
      ageGroupData={ageGroupData}
      socioeconomicData={socioeconomicData}  />
    </div>
  );
};

export default App;
