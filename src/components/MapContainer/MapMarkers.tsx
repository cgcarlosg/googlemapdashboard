/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const streetViewContainerRef = useRef<HTMLDivElement | null>(null);
  const [streetViewError, setStreetViewError] = useState<string | null>(null);

  const panoramaInstance = useRef<google.maps.StreetViewPanorama | null>(null);

  const handlePathMarkerClick = useCallback(
    (index: number) => {
      setPathPoints((prev) => {
        const newPath = prev.filter((_, i) => i !== index);
        if (newPath.length < 2) {
          setHitoActivo(null);
        }
        return newPath;
      });
    },
    [setPathPoints, setHitoActivo]
  );

  const initializeStreetView = useCallback(
    (node: HTMLDivElement | null) => {
      if (node === null) {
        if (panoramaInstance.current) {
          panoramaInstance.current.setVisible(false);
          panoramaInstance.current = null;
        }
        streetViewContainerRef.current = null;
        setStreetViewError(null);
        return;
      }

      if (hitoActivo === null || !hitos[hitoActivo] || !streetViewLib) {
        setStreetViewError(null); 
        return;
      }

      if (panoramaInstance.current && streetViewContainerRef.current === node) {
          return;
      }

      streetViewContainerRef.current = node;

      const position = hitos[hitoActivo];

      const streetViewService = new (window as any).google.maps.StreetViewService();
      const searchRadius = 200; 

      setStreetViewError(null); 

      streetViewService.getPanorama(
        { location: position, radius: searchRadius, preference: "nearest" }, 
        (data: google.maps.StreetViewPanoramaData | null, status: google.maps.StreetViewStatus) => {

          if (streetViewContainerRef.current === node && hitoActivo !== null && hitos[hitoActivo] === position) {
            if (status === (window as any).google.maps.StreetViewStatus.OK && data && data.location) {
              panoramaInstance.current = new (window as any).google.maps.StreetViewPanorama(
                node,
                {
                  position: data.location.latLng,
                  pov: { heading: 0, pitch: 0 },
                  zoom: 1,
                  visible: true,
                }
              );
              setStreetViewError(null);
            } else {
              let errorMessage = "Street View no disponible para esta ubicación.";
              if (status === (window as any).google.maps.StreetViewStatus.ZERO_RESULTS) {
                errorMessage = `Street View no disponible en un radio de ${searchRadius}m.`;
              } else {
                errorMessage = `Error al cargar Street View: ${status}.`;
              }
              setStreetViewError(errorMessage);
              console.error("Street View no disponible para esta ubicación:", status);
            }
          }
        }
      );
    },
    [hitoActivo, hitos, streetViewLib]
  );

  return (
    <>
      {pathPoints.map((point, index) => (
        <AdvancedMarker
          key={`path-point-${index}`}
          position={point}
          title={index === 0 ? "Punto de Inicio de Ruta" : "Punto Final de Ruta"}
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
        hitos.map((hito, idx) => {
          let pinColor = "#FF0000";
          const pinGlyphColor = "#FFFFFF";

          const isFirstPathPoint =
            pathPoints.length > 0 &&
            hito.lat === pathPoints[0].lat &&
            hito.lng === pathPoints[0].lng;
          const isLastPathPoint =
            pathPoints.length > 1 &&
            hito.lat === pathPoints[1].lat &&
            hito.lng === pathPoints[1].lng;

          if (isFirstPathPoint) {
            pinColor = "#FFC107";
          } else if (isLastPathPoint) {
            pinColor = "#03A9F4";
          }

          return (
            <React.Fragment key={`hito-${idx}`}>
              <AdvancedMarker position={hito} onClick={() => setHitoActivo(idx)}>
                <Pin background={pinColor} glyphColor={pinGlyphColor} />
              </AdvancedMarker>

              {hitoActivo === idx && hito && (
                <InfoWindow position={hito} onCloseClick={() => {
                   setHitoActivo(null);
                   setStreetViewError(null);
                   if (panoramaInstance.current) {
                      panoramaInstance.current.setVisible(false);
                      panoramaInstance.current = null;
                   }
                }}>
                  <div>
                    <h3>Hito {idx + 1}</h3>
                    <p>
                      <strong>Tipo:</strong> Punto de referencia
                    </p>
                    <p>
                      <strong>Flujo estimado:</strong> {100 + idx * 20} personas/hora
                    </p>

                    {streetViewError ? (

                      <div
                        style={{
                          padding: "10px",
                          color: "#FF5733",
                          fontWeight: "bold",
                          textAlign: "center",
                          backgroundColor: "#FFEBEE",
                          borderRadius: "4px",
                          border: "1px solid #FF5733",
                        }}
                      >
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
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: '#f0f0f0',
                          color: '#555',
                          fontSize: '14px',
                        }}
                      >
                        {!panoramaInstance.current && "Cargando Street View..."}
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          );
        })}

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