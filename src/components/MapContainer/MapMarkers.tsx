import React, { useRef, useCallback, useState } from "react";
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { MarkerProps } from "../../types";
import "./MapContainer.scss";

const MapMarkers: React.FC<MarkerProps> = ({
  hitos,
  mostrarHitos,
  puntosInteres,
  mostrarPuntosInteres,
  hitoActivo,
  setHitoActivo,
  pathPoints,
  setPathPoints,
}) => {
  const streetViewLib = useMapsLibrary("streetView");
  const streetViewContainer = useRef<HTMLDivElement>(null);
  const [streetViewError, setStreetViewError] = useState<string | null>(null);

  const initializeStreetView = useCallback(
    (node: HTMLDivElement | null) => {

      if (node === null || streetViewLib === null) {
        setStreetViewError(null);
        return;
      }

      streetViewContainer.current = node;

      if (
        hitoActivo !== null &&
        hitos[hitoActivo] &&
        streetViewContainer.current &&
        typeof window !== "undefined"
      ) {
        setStreetViewError(null); 
        const position = hitos[hitoActivo];
        const streetViewService = new window.google.maps.StreetViewService();

       streetViewService.getPanorama(
          { location: position, radius: 50 },
          (data, status) => {
            if (status === "OK" && data && data.location) {
              if (streetViewContainer.current) {
                new window.google.maps.StreetViewPanorama(
                  streetViewContainer.current,
                  {
                    position: data.location.latLng,
                    pov: { heading: 0, pitch: 0 },
                    zoom: 1,
                    visible: true,
                  }
                );
              }
            } else {
              setStreetViewError("Street View no disponible para esta ubicación.");
              console.error("Street View no disponible para esta ubicación.");
            }
          }
        );
      }
    },
    [hitoActivo, streetViewLib, hitos]
  );

  const handlePathMarkerClick = useCallback((index: number) => {
    setPathPoints(prev => prev.filter((_, i) => i !== index));
  }, [setPathPoints]);
  
  return (
    <>
      {pathPoints.map((point, index) => (
        <AdvancedMarker
          key={`path-point-${index}`}
          position={point}
          title={index === 0 ? "Punto de Inicio" : "Punto Final"}
          onClick={() => handlePathMarkerClick(index)}
        >
          <Pin
            background={index === 0 ? "#FFC107" : "#03A9F4"}
            glyphColor="#FFFFFF"
            borderColor={index === 0 ? "#FFC107" : "#03A9F4"}
          />
        </AdvancedMarker>
      ))}

      {mostrarHitos &&
        hitos.map((hito, idx) => (
          <React.Fragment key={`hito-${idx}`}>
            <AdvancedMarker position={hito} onClick={() => setHitoActivo(idx)}>
              <Pin background="#FF0000" />
            </AdvancedMarker>

            {hitoActivo === idx && (
              <InfoWindow
                position={hito}
                onCloseClick={() => setHitoActivo(null)}
              >
                <div>
                  <h3>Hito {idx + 1}</h3>
                  <p>
                    <strong>Tipo:</strong> Punto de referencia
                  </p>
                  <p>
                    <strong>Flujo estimado:</strong> {100 + idx * 20}{" "}
                    personas/hora
                  </p>

                  {streetViewError ? (
                    <div style={{ padding: "10px", color: "#888" }}>
                      {streetViewError}
                    </div>
                  ) : (
                    <div
                      ref={initializeStreetView}
                      style={{
                        width: "300px",
                        height: "150px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    />
                  )}
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