import React from "react";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { MarkerData } from "../../types";
import './MapContainer.scss'

interface Props {
  markers: MarkerData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>;
  hitos: google.maps.LatLngLiteral[];
  mostrarHitos: boolean;
  puntosInteres: { position: google.maps.LatLngLiteral; tipo: string }[];
  mostrarPuntosInteres: boolean;
}

const MapMarkers: React.FC<Props> = ({
  markers,
  setMarkers,
  hitos,
  mostrarHitos,
  puntosInteres,
  mostrarPuntosInteres,
}) => {
  return (
    <>
      {markers.map((marker) => (
        <AdvancedMarker
          key={marker.id}
          position={marker.position}
          title={`Marcador en: ${marker.position.lat.toFixed(4)}, ${marker.position.lng.toFixed(4)}`}
          onClick={() =>
            setMarkers((prev) => prev.filter((m) => m.id !== marker.id))
          }
        >
          <Pin />
        </AdvancedMarker>
      ))}

      {mostrarHitos &&
        hitos.map((hito, idx) => (
          <AdvancedMarker key={`hito-${idx}`} position={hito}>
            <Pin background="#FF0000" />
          </AdvancedMarker>
        ))}

      {mostrarPuntosInteres &&
        puntosInteres.map((poi, idx) => (
          <AdvancedMarker
            key={`poi-${idx}`}
            position={poi.position}
            title={poi.tipo}
          >
            <Pin background="#000000" glyphColor="#FFFFFF" />
          </AdvancedMarker>
        ))}
    </>
  );
};

export default MapMarkers;
