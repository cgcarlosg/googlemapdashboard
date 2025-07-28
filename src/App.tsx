import { useState, useCallback } from "react";
import MapContainer from "./components/MapContainer/MapContainer";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import Header from "./components/Header/Header";
import type { PoiData, HitosData, AgeGroupData, SocioeconomicData, MapContainerProps, SidebarProps, UserPath } from "./types";
import useLocalStorage from "./hooks/useLocalStorage";

const defaultCenter = { lat: 4.710989, lng: -74.07209 };

const App = () => {
  const [center, setCenter] = useLocalStorage("last-center", defaultCenter);
  const [puntosInteres, setPuntosInteres] = useState<PoiData[]>([]);
  const [hitos, setHitos] = useState<HitosData[]>([]);
  const [ageGroupData, setAgeGroupData] = useState<AgeGroupData>([]);
  const [socioeconomicData, setSocioeconomicData] = useState<SocioeconomicData>([]);
  const [pathPoints, setPathPoints] = useState<UserPath>([]);

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

  const mapProps: MapContainerProps = {
    center,
    onHitosChange: handleHitosChange,
    onPuntosInteresChange: handlePuntosInteresChange,
    onDemographicsChange: handleDemographicsChange,
    pathPoints,
    setPathPoints
  }

  const sidebarProps: SidebarProps = {
    puntosInteres: puntosInteres,
    hitos: hitos,
    ageGroupData: ageGroupData,
    socioeconomicData: socioeconomicData 
  }

  return (
    <div className="app">
      <Header onLocationSelect={setCenter} />
      <MapContainer {...mapProps} />
      <Sidebar {...sidebarProps} />
    </div>
  );
};

export default App;
