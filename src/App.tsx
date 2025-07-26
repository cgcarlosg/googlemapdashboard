import { useState } from 'react';
import MapContainer from './components/MapContainer/MapContainer';

import './App.css'
import Header from './components/Header/Header';

const defaultCenter = {lat: 4.6517, lng: -74.1265 };

const App = () => {

    const [center, setCenter] = useState(defaultCenter);

  return (
    <div className="app">
      <Header onLocationSelect={setCenter}/>
      <MapContainer center={center}/>
    </div>
  )
}

export default App
