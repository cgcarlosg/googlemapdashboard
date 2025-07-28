// MapMarkers.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useCallback, useState } from "react";
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { MarkerProps } from "../../types";
import "./MapContainer.scss"; // Asegúrate de que esta ruta sea correcta

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

  const handlePathMarkerClick = useCallback((index: number) => {
    setPathPoints((prev) => {
      const newPath = prev.filter((_, i) => i !== index);
      if (newPath.length < 2) {
        setHitoActivo(null);
      }
      return newPath;
    });
  }, [setPathPoints, setHitoActivo]);

  const initializeStreetView = useCallback(
    (node: HTMLDivElement | null) => {
      if (node === null) {
        if (panoramaInstance.current) {
          panoramaInstance.current = null;
        }
        streetViewContainerRef.current = null;
        setStreetViewError(null);
        return;
      }

      streetViewContainerRef.current = node;

      if (
        hitoActivo === null ||
        !hitos[hitoActivo] ||
        streetViewLib === null
      ) {
        setStreetViewError(null);
        return;
      }

      const position = hitos[hitoActivo];
      const streetViewService = new (window as any).google.maps.StreetViewService();

      setStreetViewError(null); // Resetear error antes de intentar cargar

      // *** AUMENTAR EL RADIO DE BÚSQUEDA ***
      // Puedes experimentar con un valor más grande, por ejemplo, 100, 200, o 500
      const searchRadius = 200; // Por ejemplo, 200 metros

      streetViewService.getPanorama(
        { location: position, radius: searchRadius }, // Usamos el nuevo radio
        (data: google.maps.StreetViewPanoramaData | null, status: google.maps.StreetViewStatus) => {
          if (status === "OK" && data && data.location) {
            if (streetViewContainerRef.current === node) {
              panoramaInstance.current = new (window as any).google.maps.StreetViewPanorama(
                node,
                {
                  position: data.location.latLng,
                  pov: { heading: 0, pitch: 0 },
                  zoom: 1,
                  visible: true,
                }
              );
            }
          } else {
            // Se encontró ZERO_RESULTS u otro error
            let errorMessage = "Street View no disponible para esta ubicación.";
            if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
              errorMessage = `Street View no disponible en un radio de ${searchRadius}m.`;
            } else {
              errorMessage = `Error al cargar Street View: ${status}.`;
            }
            setStreetViewError(errorMessage);
            console.error("Street View no disponible para esta ubicación:", status);
          }
        }
      );
    },
    [hitoActivo, hitos, streetViewLib]
  );

  return (
    <>
      {/* Marcadores de los puntos de inicio/fin de la ruta (pathPoints) */}
      {pathPoints.map((point, index) => (
        <AdvancedMarker
          key={`path-point-${index}`}
          position={point}
          title={index === 0 ? "Punto de Inicio de Ruta" : "Punto Final de Ruta"}
          onClick={() => handlePathMarkerClick(index)}
        >
          <Pin
            background={index === 0 ? "#FFC107" : "#03A9F4"} // Amarillo para inicio, azul para fin
            glyphColor="#FFFFFF"
            borderColor={index === 0 ? "#FFC107" : "#03A9F4"}
          />
        </AdvancedMarker>
      ))}

      {/* Marcadores de los hitos interpolados (si mostrarHitos está activo) */}
      {mostrarHitos &&
        hitos.map((hito, idx) => {
          let pinColor = "#FF0000"; // Color por defecto para hitos interpolados
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

              {hitoActivo === idx && (
                <InfoWindow position={hito} onCloseClick={() => setHitoActivo(null)}>
                  <div>
                    <h3>Hito {idx + 1}</h3>
                    <p>
                      <strong>Tipo:</strong> Punto de referencia
                    </p>
                    <p>
                      <strong>Flujo estimado:</strong> {100 + idx * 20} personas/hora
                    </p>

                    {streetViewError ? (
                      // Estilo para el mensaje de error de Street View
                      <div
                        style={{
                          padding: "10px",
                          color: "#FF5733", // Un color más llamativo para el error
                          fontWeight: "bold",
                          textAlign: "center",
                          backgroundColor: "#FFEBEE", // Fondo suave para el error
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
                          // Añade un fondo de carga o un mensaje si lo deseas
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f0f0f0',
                          color: '#555',
                          fontSize: '14px',
                        }}
                      >
                        {/* Puedes poner un spinner o "Cargando Street View..." aquí */}
                        Cargando Street View...
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          );
        })}

      {/* Marcadores de Puntos de Interés (POIs) */}
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