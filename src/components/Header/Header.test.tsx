import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";
import { mockLocations } from "../../data/MockLocations";

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

describe("Header", () => {
  const mockOnLocationSelect = vi.fn();
  const mockOnNewRouteStart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays the search input and logos", () => {
    render(
      <Header
        onLocationSelect={mockOnLocationSelect}
        onNewRouteStart={mockOnNewRouteStart}
      />
    );
    const input = screen.getByTestId("location-input");
    expect(input).toBeInTheDocument();
    const logos = screen.getAllByAltText("Logo");
    expect(logos).toHaveLength(2);
    expect(logos[0]).toBeInTheDocument();
    expect(logos[1]).toBeInTheDocument();
  });

  it("shows suggestions when typing", () => {
    render(
      <Header
        onLocationSelect={mockOnLocationSelect}
        onNewRouteStart={mockOnNewRouteStart}
      />
    );
    const input = screen.getByTestId("location-input");

    fireEvent.change(input, { target: { value: "Bogotá" } });

    const suggestion = screen.getByText("Bogotá Centro");
    expect(suggestion).toBeInTheDocument();
  });

  it("calls onLocationSelect and onNewRouteStart when a suggestion is clicked", () => {
    render(
      <Header
        onLocationSelect={mockOnLocationSelect}
        onNewRouteStart={mockOnNewRouteStart}
      />
    );
    const input = screen.getByTestId("location-input");

    fireEvent.change(input, { target: { value: "Centro" } });
    const suggestion = screen.getByText("Centro PriceSmart");

    fireEvent.click(suggestion);

    const expectedLocation = mockLocations.find(loc => loc.name === "Centro PriceSmart");
    
    expect(mockOnLocationSelect).toHaveBeenCalledTimes(1);
    expect(mockOnLocationSelect).toHaveBeenCalledWith(expectedLocation?.coords);

    expect(mockOnNewRouteStart).toHaveBeenCalledTimes(1);
    expect(mockOnNewRouteStart).toHaveBeenCalledWith(expectedLocation?.coords);
  });

  it("hides suggestions after selection", () => {
    render(
      <Header
        onLocationSelect={mockOnLocationSelect}
        onNewRouteStart={mockOnNewRouteStart}
      />
    );
    const input = screen.getByTestId("location-input");
    fireEvent.change(input, { target: { value: "Bogotá" } });
    expect(screen.getByText("Bogotá Centro")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Bogotá Centro"));
    expect(screen.queryByText("Bogotá Centro")).not.toBeInTheDocument();
  });

  it("displays 'No se encontraron resultados' when no matches", () => {
    render(
      <Header
        onLocationSelect={mockOnLocationSelect}
        onNewRouteStart={mockOnNewRouteStart}
      />
    );
    const input = screen.getByTestId("location-input");
    fireEvent.change(input, { target: { value: "NonExistentLocation" } });

    expect(screen.getByText("No se encontraron resultados")).toBeInTheDocument();
  });
});