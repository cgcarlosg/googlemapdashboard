// src/components/MapDashboard.tsx
import React, { useCallback, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  DrawingManager,
} from "@react-google-maps/api";

import "./MapDashboard.scss";

const center = {
  lat: 4.710989,
  lng: -74.07209,
};

const MapDashboard: React.FC = () => {
  const [shapes, setShapes] = useState<
    Array<
      | google.maps.Circle
      | google.maps.Polygon
      | google.maps.Polyline
      | google.maps.Rectangle
    >
  >([]);
console.log(shapes)
  const onOverlayComplete = useCallback(
    (e: google.maps.drawing.OverlayCompleteEvent) => {
      const newShape = e.overlay;
      const type = e.type;

      if (type === "marker") {
        console.log("Se ignoró un marcador");
        return;
      }

      setShapes((prev) => [
        ...prev,
        newShape as
          | google.maps.Circle
          | google.maps.Polygon
          | google.maps.Polyline
          | google.maps.Rectangle,
      ]);

      console.log("Dibujo completo:", type, newShape);
    },
    []
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing"],
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
        <DrawingManager
          onOverlayComplete={onOverlayComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                "polygon",
                "rectangle",
                "circle",
                "polyline",
              ] as google.maps.drawing.OverlayType[],
            },
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default MapDashboard;
