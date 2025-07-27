/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MapMarkers from "./MapMarkers";
import type { MarkerProps } from "../../types";

const mockStreetViewService = {
  getPanorama: vi.fn(),
};
const mockStreetViewPanorama = vi.fn();

beforeEach(() => {
  (window as any).google = {
    maps: {
      StreetViewService: vi.fn(() => mockStreetViewService),
      StreetViewPanorama: mockStreetViewPanorama,
    },
  };
});

vi.mock("@vis.gl/react-google-maps", () => ({
  ...vi.importActual("@vis.gl/react-google-maps"),
  useMapsLibrary: () => ({
    StreetViewService: (window as any).google.maps.StreetViewService,
    StreetViewPanorama: (window as any).google.maps.StreetViewPanorama,
  }),
  AdvancedMarker: ({ onClick, children }: any) => (
    <button onClick={onClick} data-testid="advanced-marker">
      {children}
    </button>
  ),
  Pin: () => <div data-testid="pin" />,
  InfoWindow: ({ onCloseClick, children }: any) => (
    <div data-testid="info-window-mock">
      <button onClick={onCloseClick} data-testid="close-info-window-btn" />
      {children}
    </div>
  ),
}));

const mockMarkerProps: MarkerProps = {
  markers: [{ id: "1", position: { lat: 10, lng: 10 } }],
  setMarkers: vi.fn(),
  hitos: [{ lat: 20, lng: 20 }, { lat: 30, lng: 30 }],
  mostrarHitos: true,
  puntosInteres: [{ position: { lat: 40, lng: 40 }, tipo: "Parque" }],
  mostrarPuntosInteres: true,
  hitoActivo: null,
  setHitoActivo: vi.fn(),
};

describe("MapMarkers", () => {
  it("renders user markers and responds to clicks", () => {
    const { getAllByTestId } = render(<MapMarkers {...mockMarkerProps} />);
    const markerButton = getAllByTestId("advanced-marker")[0]; 
    
    fireEvent.click(markerButton);
    
    expect(mockMarkerProps.setMarkers).toHaveBeenCalledTimes(1);
  });

  it("renders milestones and opens InfoWindow on click", () => {
    mockStreetViewService.getPanorama.mockImplementation((_, callback) => {
      callback({ location: { latLng: { lat: 20, lng: 20 } } }, "OK");
    });
    
    const { getAllByTestId } = render(<MapMarkers {...mockMarkerProps} />);
    
    const hitoButtons = getAllByTestId("advanced-marker");
    fireEvent.click(hitoButtons[1]);
    
    expect(mockMarkerProps.setHitoActivo).toHaveBeenCalledWith(0);
    
    const { getByTestId, getByText } = render(<MapMarkers {...mockMarkerProps} hitoActivo={0} />);

    expect(getByTestId("info-window-mock")).toBeInTheDocument();
    expect(getByText("Hito 1")).toBeInTheDocument();
    
    expect(mockStreetViewService.getPanorama).toHaveBeenCalledWith(
      { location: { lat: 20, lng: 20 }, radius: 50 },
      expect.any(Function)
    );
    
    expect(mockStreetViewPanorama).toHaveBeenCalled();
  });

  it("shows an error message if Street View is not available", () => {
    mockStreetViewService.getPanorama.mockImplementation((_, callback) => {
      callback(null, "ZERO_RESULTS");
    });
    
    render(<MapMarkers {...mockMarkerProps} hitoActivo={0} />);
    
    expect(screen.getByTestId("info-window-mock")).toBeInTheDocument();

    expect(screen.getByText("Street View no disponible.")).toBeInTheDocument();
  });

  it("closes the InfoWindow on close button click", () => {
    render(<MapMarkers {...mockMarkerProps} hitoActivo={0} />);
    const closeButton = screen.getByTestId("close-info-window-btn");

    fireEvent.click(closeButton);
    
    expect(mockMarkerProps.setHitoActivo).toHaveBeenCalledWith(null);
  });
});