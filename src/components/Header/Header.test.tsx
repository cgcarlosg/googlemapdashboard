import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";

const mockOnLocationSelect = vi.fn();

describe("Header", () => {
  it("displays the search input", () => {
    render(<Header onLocationSelect={mockOnLocationSelect} />);
    const input = screen.getByTestId("location-input");
    expect(input).toBeInTheDocument();
  });

  it("shows suggestions when typing", () => {
    render(<Header onLocationSelect={mockOnLocationSelect} />);
    const input = screen.getByTestId("location-input");

    fireEvent.change(input, { target: { value: "Bogotá" } });

    const suggestion = screen.getByText("Bogotá Centro");
    expect(suggestion).toBeInTheDocument();
  });

  it("calls onLocationSelect when a suggestion is clicked", () => {
    render(<Header onLocationSelect={mockOnLocationSelect} />);
    const input = screen.getByTestId("location-input");

    fireEvent.change(input, { target: { value: "Centro" } });
    const suggestion = screen.getByText("Centro PriceSmart");

    fireEvent.click(suggestion);
    expect(mockOnLocationSelect).toHaveBeenCalledWith({ lat: 4.7468, lng: -74.0252 });
  });
});
