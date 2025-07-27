import React from "react";
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import type { MarkerData } from "../../types";
import './MapContainer.scss'

interface Props {
  markers: MarkerData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>;
  hitos: google.maps.LatLngLiteral[];
  mostrarHitos: boolean;
  puntosInteres: { position: google.maps.LatLngLiteral; tipo: string }[];
  mostrarPuntosInteres: boolean;
  hitoActivo: number | null;
  setHitoActivo: React.Dispatch<React.SetStateAction<number | null>>; 
}

const MapMarkers: React.FC<Props> = ({
  markers,
  setMarkers,
  hitos,
  mostrarHitos,
  puntosInteres,
  mostrarPuntosInteres,
  hitoActivo,
  setHitoActivo
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
    <React.Fragment key={`hito-${idx}`}>
      <AdvancedMarker
        position={hito}
        onClick={() => setHitoActivo(idx)}
      >
        <Pin background="#FF0000" />
      </AdvancedMarker>

      {hitoActivo === idx && (
        <InfoWindow
          position={hito}
          onCloseClick={() => setHitoActivo(null)}
        >
          <div>
            <h3>Hito {idx + 1}</h3>
            <p><strong>Tipo:</strong> Punto de referencia</p>
            <p><strong>Flujo estimado:</strong> {100 + idx * 20} personas/hora</p>
          </div>
        </InfoWindow>
      )}
    </React.Fragment>
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
