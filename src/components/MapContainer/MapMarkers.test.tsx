/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react"; 
import { describe, it, expect, vi, beforeEach } from "vitest";
import MapMarkers from "./MapMarkers";
import type { MockMapMarkersProps, UserPath } from '../../types'

const mockStreetViewService = {
    getPanorama: vi.fn(),
};
const mockStreetViewPanorama = vi.fn();

beforeEach(() => {
    (window as any).google = {
        maps: {
            StreetViewService: vi.fn(() => mockStreetViewService),
            StreetViewPanorama: mockStreetViewPanorama,
            StreetViewStatus: {
                OK: "OK",
                ZERO_RESULTS: "ZERO_RESULTS"
            }
        },
    };
    vi.clearAllMocks();
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

type MockDispatch<T> = ((value: T | ((prev: T) => T)) => void) & { mock: { calls: any[][] } };

const mockMapMarkersProps: MockMapMarkersProps = {
    hitos: [
        { lat: 20.0, lng: 20.0 },
        { lat: 30.0, lng: 30.0 },
        { lat: 40.0, lng: 40.0 },
    ],
    mostrarHitos: true,
    puntosInteres: [
        { position: { lat: 50.0, lng: 50.0 }, tipo: "Parque" },
        { position: { lat: 60.0, lng: 60.0 }, tipo: "Restaurante" },
    ],
    mostrarPuntosInteres: true,
    hitoActivo: null,
    setHitoActivo: vi.fn() as MockDispatch<number | null>, 
    pathPoints: [
        { lat: 10.0, lng: 10.0 },
        { lat: 15.0, lng: 15.0 },
    ],
    setPathPoints: vi.fn() as MockDispatch<UserPath>,
};

describe("MapMarkers", () => {
    it("renders path points and allows removing them on click", () => {
        const initialPathPoints = [
            { lat: 10.0, lng: 10.0 },
            { lat: 15.0, lng: 15.0 }
        ];
        const testProps = {
            ...mockMapMarkersProps,
            pathPoints: initialPathPoints,
            setPathPoints: vi.fn() as MockDispatch<UserPath>,
            setHitoActivo: vi.fn() as MockDispatch<number | null>,
        };
        const { getAllByTestId } = render(<MapMarkers {...testProps} />);

        const pathPointMarkers = getAllByTestId("advanced-marker").slice(0, initialPathPoints.length);

        expect(pathPointMarkers).toHaveLength(initialPathPoints.length);

        fireEvent.click(pathPointMarkers[0]);

        expect(testProps.setPathPoints).toHaveBeenCalledTimes(1);
        expect(testProps.setPathPoints).toHaveBeenCalledWith(expect.any(Function));
        const updateFunction = testProps.setPathPoints.mock.calls[0][0]; 
        expect(updateFunction(initialPathPoints)).toEqual([{ lat: 15.0, lng: 15.0 }]);
        expect(testProps.setHitoActivo).toHaveBeenCalledWith(null);
    });

    it("renders milestones (hitos) and opens InfoWindow on click, loading Street View", async () => {
        mockStreetViewService.getPanorama.mockImplementation((_, callback) => {
            callback({ location: { latLng: { lat: 20, lng: 20 } } }, "OK");
        });

        const testProps = {
            ...mockMapMarkersProps,
            hitoActivo: null,
            setHitoActivo: vi.fn() as MockDispatch<number | null>,
            setPathPoints: vi.fn() as MockDispatch<UserPath>,
        };

        const { getAllByTestId, getByTestId, getByText, rerender } = render(<MapMarkers {...testProps} />); 
        const allMarkers = getAllByTestId("advanced-marker");
        const hitoMarkers = allMarkers.slice(mockMapMarkersProps.pathPoints.length, mockMapMarkersProps.pathPoints.length + mockMapMarkersProps.hitos.length);
        fireEvent.click(hitoMarkers[0]);

       expect(testProps.setHitoActivo).toHaveBeenCalledWith(0);
        rerender(<MapMarkers {...testProps} hitoActivo={0} />); 
        
        await waitFor(() => {
            expect(getByTestId("info-window-mock")).toBeInTheDocument();
        });

        expect(getByText("Hito 1")).toBeInTheDocument();
        expect(getByText("Cargando Street View...")).toBeInTheDocument();
        expect(mockStreetViewService.getPanorama).toHaveBeenCalledWith(
            { location: { lat: 20.0, lng: 20.0 }, radius: 200 }, 
            expect.any(Function)
        );
        await waitFor(() => {
            expect(mockStreetViewPanorama).toHaveBeenCalledTimes(1);
        });
    });

    it("shows an error message if Street View is not available (ZERO_RESULTS)", async () => {
        mockStreetViewService.getPanorama.mockImplementation((_, callback) => {
            callback(null, "ZERO_RESULTS");
        });
        const { getByTestId, getByText } = render(<MapMarkers {...mockMapMarkersProps} hitoActivo={0} />);

        await waitFor(() => {
            expect(getByTestId("info-window-mock")).toBeInTheDocument();
            expect(getByText("Street View no disponible en un radio de 200m.")).toBeInTheDocument();
        });
    });

    it("shows a generic error message if Street View loading fails for other reasons", async () => {
        mockStreetViewService.getPanorama.mockImplementation((_, callback) => {
            callback(null, "REQUEST_DENIED");
        });

        const { getByText } = render(<MapMarkers {...mockMapMarkersProps} hitoActivo={0} />);

        await waitFor(() => {
            expect(getByText("Error al cargar Street View: REQUEST_DENIED.")).toBeInTheDocument();
        });
    });

    it("closes the InfoWindow on close button click and clears active hito", async () => {
        const { getByTestId } = render(<MapMarkers {...mockMapMarkersProps} hitoActivo={0} />);

        const closeButton = getByTestId("close-info-window-btn");
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByTestId("info-window-mock")).not.toBeInTheDocument();
        });

        expect(mockMapMarkersProps.setHitoActivo).toHaveBeenCalledWith(null);
    });

    it("renders POI markers when mostrarPuntosInteres is true", () => {
        const { getAllByTestId } = render(<MapMarkers {...mockMapMarkersProps} mostrarPuntosInteres={true} />);
        const expectedMarkers =
            mockMapMarkersProps.pathPoints.length +
            mockMapMarkersProps.hitos.length +
            mockMapMarkersProps.puntosInteres.length;

        expect(getAllByTestId("advanced-marker")).toHaveLength(expectedMarkers);
    });

    it("does not render POI markers when mostrarPuntosInteres is false", () => {
        const { queryAllByTestId } = render(<MapMarkers {...mockMapMarkersProps} mostrarPuntosInteres={false} />);
        const expectedMarkers =
            mockMapMarkersProps.pathPoints.length +
            mockMapMarkersProps.hitos.length;

        expect(queryAllByTestId("advanced-marker")).toHaveLength(expectedMarkers);
    });

    it("does not render Hito markers when mostrarHitos is false", () => {
        const { queryAllByTestId } = render(<MapMarkers {...mockMapMarkersProps} mostrarHitos={false} />);
        const expectedMarkers =
            mockMapMarkersProps.pathPoints.length +
            mockMapMarkersProps.puntosInteres.length;

        expect(queryAllByTestId("advanced-marker")).toHaveLength(expectedMarkers);
    });
});