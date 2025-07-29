import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MapControls from "./MapControls";
import type { MapControlsProps } from "../../types"; 

describe("MapControls", () => {
    const mockProps: MapControlsProps = {
        mostrarHitos: true,
        setMostrarHitos: vi.fn(),
        mostrarCirculos: false,
        setMostrarCirculos: vi.fn(),
        mostrarPuntosInteres: true,
        setMostrarPuntosInteres: vi.fn(),
        onClearData: vi.fn(),
    };

    it("renders checkboxes with correct initial checked states", () => {
        render(<MapControls {...mockProps} />);

        const hitosCheckbox = screen.getByLabelText("Mostrar Hitos") as HTMLInputElement;
        const circulosCheckbox = screen.getByLabelText("Mostrar Círculos") as HTMLInputElement;
        const poiCheckbox = screen.getByLabelText("Mostrar Puntos de Interés") as HTMLInputElement;

        expect(hitosCheckbox.checked).toBe(true);
        expect(circulosCheckbox.checked).toBe(false);
        expect(poiCheckbox.checked).toBe(true);
    });

    it("calls setMostrarHitos when 'Mostrar Hitos' checkbox is clicked", () => {
        render(<MapControls {...mockProps} />);

        const hitosCheckbox = screen.getByLabelText("Mostrar Hitos");
        fireEvent.click(hitosCheckbox);

        expect(mockProps.setMostrarHitos).toHaveBeenCalledTimes(1);
        expect(mockProps.setMostrarHitos).toHaveBeenCalledWith(false);
    });

    it("calls setMostrarCirculos when 'Mostrar Círculos' checkbox is clicked", () => {
        render(<MapControls {...mockProps} />);

        const circulosCheckbox = screen.getByLabelText("Mostrar Círculos");
        fireEvent.click(circulosCheckbox);

        expect(mockProps.setMostrarCirculos).toHaveBeenCalledTimes(1);
        expect(mockProps.setMostrarCirculos).toHaveBeenCalledWith(true);
    });

    it("calls setMostrarPuntosInteres when 'Mostrar Puntos de Interés' checkbox is clicked", () => {
        render(<MapControls {...mockProps} />);

        const poiCheckbox = screen.getByLabelText("Mostrar Puntos de Interés");
        fireEvent.click(poiCheckbox);

        expect(mockProps.setMostrarPuntosInteres).toHaveBeenCalledTimes(1);
        expect(mockProps.setMostrarPuntosInteres).toHaveBeenCalledWith(false);
    });

    it("calls onClearData when 'Limpiar Datos' button is clicked", () => {
        render(<MapControls {...mockProps} />);

        const clearButton = screen.getByRole("button", { name: /Limpiar Datos/i });
        fireEvent.click(clearButton);

        expect(mockProps.onClearData).toHaveBeenCalledTimes(1);
    });
});