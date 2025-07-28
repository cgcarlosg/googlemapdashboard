import { useCallback, useEffect, useState } from "react";
import MapContainer from "./components/MapContainer/MapContainer";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import Header from "./components/Header/Header";
import type { PoiData, HitosData, AgeGroupData, SocioeconomicData, MapContainerProps, SidebarProps, UserPath } from "./types";
import useLocalStorage from "./hooks/useLocalStorage";
import { interpolatePoints, generarPuntoAleatorioEnCirculo } from "./utils/mapUtils";

const defaultCenter = { lat: 4.710989, lng: -74.07209 };

const App = () => {
  const [center, setCenter] = useLocalStorage("last-center", defaultCenter);
  const [pathPoints, setPathPoints] = useLocalStorage<UserPath>("mapPathPoints", []);
  const [hitos, setHitos] = useLocalStorage<HitosData[]>("mapHitos", []);
  const [puntosInteres, setPuntosInteres] = useLocalStorage<PoiData[]>("mapPuntosInteres", []);
  const [ageGroupData, setAgeGroupData] = useLocalStorage<AgeGroupData>("mapAgeData", []);
  const [socioeconomicData, setSocioeconomicData] = useLocalStorage<SocioeconomicData>("mapSocioData", []);
  const [mostrarHitos, setMostrarHitos] = useState(true);
  const [mostrarCirculos, setMostrarCirculos] = useState(true); 
  const [mostrarPuntosInteres, setMostrarPuntosInteres] = useState(true);

  useEffect(() => {
    if (pathPoints.length < 2) {
      setHitos([]);
      setPuntosInteres([]);
      setAgeGroupData([]);
      setSocioeconomicData([]);
      return;
    }

    const interpolatedPoints = interpolatePoints(pathPoints, 1000);
    const allHitos: google.maps.LatLngLiteral[] = [];
    if (pathPoints[0]) allHitos.push(pathPoints[0]);
    interpolatedPoints.forEach(p => {
      if (!(p.lat === pathPoints[0].lat && p.lng === pathPoints[0].lng)) {
        allHitos.push(p);
      }
    });
    if (pathPoints[1] && !(allHitos[allHitos.length - 1]?.lat === pathPoints[1].lat && allHitos[allHitos.length - 1]?.lng === pathPoints[1].lng)) {
      allHitos.push(pathPoints[1]);
    }
    setHitos(allHitos);

    const tipos = ["Parque", "Restaurante", "Tienda"];
    const nuevosPOI: PoiData[] = [];
    allHitos.forEach((punto) => {
      for (let i = 0; i < 2; i++) {
        const pos = generarPuntoAleatorioEnCirculo(punto, 450);
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        nuevosPOI.push({ position: pos, tipo });
      }
    });
    setPuntosInteres(nuevosPOI); 

    const newAgeData: AgeGroupData = [
      { name: '0-17 años', value: Math.floor(Math.random() * 100) + 20, color: '#8884d8' },
      { name: '18-35 años', value: Math.floor(Math.random() * 100) + 80, color: '#82ca9d' },
      { name: '36-55 años', value: Math.floor(Math.random() * 100) + 50, color: '#ffc658' },
      { name: '56+ años', value: Math.floor(Math.random() * 50) + 10, color: '#ff7300' },
    ];
    const newSocioData: SocioeconomicData = [
      { name: 'Clase A', value: Math.floor(Math.random() * 30) + 10, color: '#0088FE' },
      { name: 'Clase B', value: Math.floor(Math.random() * 60) + 30, color: '#00C49F' },
      { name: 'Clase C', value: Math.floor(Math.random() * 80) + 50, color: '#FFBB28' },
      { name: 'Clase D', value: Math.floor(Math.random() * 40) + 20, color: '#FF8042' },
      { name: 'Clase E', value: Math.floor(Math.random() * 20) + 5, color: '#AF19FF' },
    ];
    setAgeGroupData(newAgeData);
    setSocioeconomicData(newSocioData);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathPoints]);

  const handleClearData = useCallback(() => {
    setPathPoints([]);
    setHitos([]);
    setPuntosInteres([]);
    setAgeGroupData([]);
    setSocioeconomicData([]);

    localStorage.removeItem("mapPathPoints");
    localStorage.removeItem("mapHitos");
    localStorage.removeItem("mapPuntosInteres");
    localStorage.removeItem("mapAgeData");
    localStorage.removeItem("mapSocioData");

  }, [setPathPoints, setHitos, setPuntosInteres, setAgeGroupData, setSocioeconomicData]);

   const handleNewRouteStart = useCallback((coords: google.maps.LatLngLiteral) => {
        handleClearData();
        setPathPoints([coords]);
        setCenter(coords);
    }, [handleClearData, setPathPoints, setCenter]);

  const mapProps: MapContainerProps = {
    center,
    hitos,
    puntosInteres,
    ageData: ageGroupData,
    socioData: socioeconomicData,
    pathPoints,
    setPathPoints,
    onClearData: handleClearData,
    mostrarHitos,
    setMostrarHitos,
    mostrarCirculos,
    setMostrarCirculos,
    mostrarPuntosInteres,
    setMostrarPuntosInteres,
  }

  const sidebarProps: SidebarProps = {
    puntosInteres: puntosInteres,
    hitos: hitos,
    ageGroupData: ageGroupData,
    socioeconomicData: socioeconomicData,
    mostrarHitos,
    mostrarPuntosInteres,
    mostrarCirculos,
  }

  return (
    <div className="app">
      <Header onLocationSelect={setCenter} onNewRouteStart={handleNewRouteStart} />
      <MapContainer {...mapProps} />
      <Sidebar {...sidebarProps} />
    </div>
  );
};

export default App;