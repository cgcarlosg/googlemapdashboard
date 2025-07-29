/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MapContainer from "./MapContainer";
import type { MapContainerProps } from "../../types";

vi.mock("@vis.gl/react-google-maps", () => ({
    APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Map: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AdvancedMarker: ({ position }: { position: any }) => (
        <div data-testid="marker" data-position={JSON.stringify(position)} />
    ),
    Circle: ({ radius }: { radius: number }) => (
        <div data-testid="circle" data-radius={radius} />
    ),
    InfoWindow: () => <div data-testid="info-window-mock" />,
    Pin: () => <div data-testid="pin" />,
    useMapsLibrary: () => ({}),
}));

const center: MapContainerProps["center"] = { lat: 10, lng: 10 };

const baseMockMapContainerProps: MapContainerProps = {
    center: center,
    hitos: [],
    puntosInteres: [],
    ageData: [],
    socioData: [],
    pathPoints: [],
    setPathPoints: vi.fn(),
    onClearData: vi.fn(),
    mostrarHitos: true,
    setMostrarHitos: vi.fn(),
    mostrarCirculos: true,
    setMostrarCirculos: vi.fn(),
    mostrarPuntosInteres: true,
    setMostrarPuntosInteres: vi.fn(),
};

describe("MapContainer", () => {
    it("renders the controls and the map", () => {
        render(<MapContainer {...baseMockMapContainerProps} />);

        expect(screen.getByLabelText("Mostrar Hitos")).toBeInTheDocument();
        expect(screen.getByLabelText("Mostrar Círculos")).toBeInTheDocument();
        expect(screen.getByLabelText("Mostrar Puntos de Interés")).toBeInTheDocument();
    });

    it("allows toggling landmarks on and off", () => {
        const setMostrarHitosMock = vi.fn();
        const testProps = {
            ...baseMockMapContainerProps,
            setMostrarHitos: setMostrarHitosMock,
            mostrarHitos: true,
        };
        const { rerender } = render(<MapContainer {...testProps} />);
        const checkbox = screen.getByLabelText("Mostrar Hitos") as HTMLInputElement;

        expect(checkbox.checked).toBe(true);

        fireEvent.click(checkbox);
        
        expect(setMostrarHitosMock).toHaveBeenCalledWith(false);
        rerender(<MapContainer {...testProps} mostrarHitos={false} />);
        expect(checkbox.checked).toBe(false);
    });

    it("allows toggling circles on and off", () => {
        const setMostrarCirculosMock = vi.fn();
        const testProps = {
            ...baseMockMapContainerProps,
            setMostrarCirculos: setMostrarCirculosMock,
            mostrarCirculos: true,
        };
        const { rerender } = render(<MapContainer {...testProps} />);
        const checkbox = screen.getByLabelText("Mostrar Círculos") as HTMLInputElement;

        expect(checkbox.checked).toBe(true);
        fireEvent.click(checkbox);
        expect(setMostrarCirculosMock).toHaveBeenCalledWith(false);

        rerender(<MapContainer {...testProps} mostrarCirculos={false} />);
        expect(checkbox.checked).toBe(false);
    });

    it("allows toggling points of interest on and off", () => {
        const setMostrarPuntosInteresMock = vi.fn();
        const testProps = {
            ...baseMockMapContainerProps,
            setMostrarPuntosInteres: setMostrarPuntosInteresMock,
            mostrarPuntosInteres: true,
        };
        const { rerender } = render(<MapContainer {...testProps} />);
        const checkbox = screen.getByLabelText("Mostrar Puntos de Interés") as HTMLInputElement;

        expect(checkbox.checked).toBe(true);
        fireEvent.click(checkbox);
        expect(setMostrarPuntosInteresMock).toHaveBeenCalledWith(false);

        rerender(<MapContainer {...testProps} mostrarPuntosInteres={false} />);
        expect(checkbox.checked).toBe(false);
    });
});