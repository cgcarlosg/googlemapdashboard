/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MapContainer from "./MapContainer";
import type { AppProps } from "../../types";
vi.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AdvancedMarker: ({ position }: { position: any }) => (
    <div data-testid="marker" data-position={JSON.stringify(position)} />
  ),
  Circle: ({ radius }: { radius: number }) => (
    <div data-testid="circle" data-radius={radius} />
  ),
}));


const center: AppProps["center"] = { lat: 10, lng: 10 };

describe("MapContainer", () => {
  it("renders the controls and the map", () => {
    render(<MapContainer center={center} />);
    
    expect(screen.getByLabelText("Mostrar Hitos")).toBeInTheDocument();
    expect(screen.getByLabelText("Mostrar Círculos")).toBeInTheDocument();
    expect(screen.getByLabelText("Mostrar Puntos de Interés")).toBeInTheDocument();
  });

  it("allows toggling landmarks on and off", () => {
    render(<MapContainer center={center} />);
    const checkbox = screen.getByLabelText("Mostrar Hitos") as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("allows toggling circles on and off", () => {
    render(<MapContainer center={center} />);
    const checkbox = screen.getByLabelText("Mostrar Círculos") as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("allows toggling points of interest on and off", () => {
    render(<MapContainer center={center} />);
    const checkbox = screen.getByLabelText("Mostrar Puntos de Interés") as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });
});
