import { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer/MapContainer';

import './App.css'
import Header from './components/Header/Header';

const defaultCenter = { lat: 4.710989, lng: -74.07209 };
const saved = localStorage.getItem("last-center");
const initialCenter = saved ? JSON.parse(saved) : defaultCenter;

const App = () => {

    const [center, setCenter] = useState(initialCenter);

    useEffect(() => {
    localStorage.setItem("last-center", JSON.stringify(center));
  }, [center]);

  return (
    <div className="app">
      <Header onLocationSelect={setCenter}/>
      <MapContainer center={center}/>
    </div>
  )
}

export default App
