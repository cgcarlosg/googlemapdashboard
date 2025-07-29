import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Sidebar from "./Sidebar";
import type { SidebarProps } from "../../types";

vi.mock("../ChartWidget/CharWidget", () => ({
  default: vi.fn((props) => (
    <div data-testid={`chart-widget-${props.id}`}>
      <h3>{props.title}</h3>
      {props.isVisible && props.hasData ? (
        <>
          {typeof props.content === 'object' && props.content !== null && '$$typeof' in props.content ? props.content : null}
          {props.chartData && <span data-testid="chart-data-present">Chart Data</span>}
          {props.headerLabel && <span data-testid="header-label">{props.headerLabel}</span>}
        </>
      ) : (
        <span data-testid="no-data-message">{props.noDataMessage && props.noDataMessage.props && props.noDataMessage.props.children ? props.noDataMessage.props.children : 'No Data'}</span>
      )}
    </div>
  )),
}));

import ChartWidget from "../ChartWidget/CharWidget";

const mockHitos = [{ lat: 10, lng: 10 }, { lat: 20, lng: 20 }];
const mockPuntosInteres = [
  { position: { lat: 1, lng: 1 }, tipo: "Parque" },
  { position: { lat: 2, lng: 2 }, tipo: "Restaurante" },
  { position: { lat: 3, lng: 3 }, tipo: "Parque" },
];
const mockAgeGroupData = [
  { name: "0-18", value: 50, color: "#FF0000" },
  { name: "19-60", value: 150, color: "#00FF00" },
];
const mockSocioeconomicData = [
  { name: "Bajo", value: 70, color: "#0000FF" },
  { name: "Medio", value: 130, color: "#FFFF00" },
];

const defaultProps: SidebarProps = {
  puntosInteres: mockPuntosInteres,
  hitos: mockHitos,
  ageGroupData: mockAgeGroupData,
  socioeconomicData: mockSocioeconomicData,
  mostrarHitos: true,
  mostrarPuntosInteres: true,
  mostrarCirculos: true,
};

const getChartWidgetPropsById = (id: string) => {
  const call = (ChartWidget as ReturnType<typeof vi.fn>).mock.calls.find(
    ([props]) => props.id === id
  );
  return call ? call[0] : null;
};

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with default props (all visible)", () => {
    render(<Sidebar {...defaultProps} />);
    
    expect(ChartWidget).toHaveBeenCalledTimes(4);

    expect(screen.getByText("Hitos en la Ruta")).toBeInTheDocument();
    expect(screen.getByText("Resumen de Puntos de Interés")).toBeInTheDocument();
    expect(screen.getByText("Franjas Etarias")).toBeInTheDocument();
    expect(screen.getByText("Nivel Socioeconómico")).toBeInTheDocument();
  });

  it("displays total hitos when 'mostrarHitos' is true and hitos exist", () => {
    render(<Sidebar {...defaultProps} mostrarHitos={true} hitos={mockHitos} />);
    const hitosWidgetProps = getChartWidgetPropsById("hitos");
    expect(hitosWidgetProps?.isVisible).toBe(true);
    expect(hitosWidgetProps?.hasData).toBe(true);

    const hitosWidget = screen.getByTestId("chart-widget-hitos");

    expect(within(hitosWidget).getByRole('paragraph', {
      name: (_content, element) => {
        const textContent = element?.textContent?.trim() || '';
        return textContent.includes("Total de Hitos:") && textContent.includes("2");
      }
    })).toBeInTheDocument();
  });


  it("shows 'no data' message for hitos when 'mostrarHitos' is true but no hitos", () => {
    render(<Sidebar {...defaultProps} mostrarHitos={true} hitos={[]} />);
    
    const hitosWidgetProps = getChartWidgetPropsById("hitos");
    expect(hitosWidgetProps?.isVisible).toBe(true);
    expect(hitosWidgetProps?.hasData).toBe(false);
    expect(screen.getByText("No hay hitos generados para la ruta actual o están ocultos.")).toBeInTheDocument();
  });

  it("hides hitos section when 'mostrarHitos' is false", () => {
    render(<Sidebar {...defaultProps} mostrarHitos={false} />);
    
    const hitosWidgetProps = getChartWidgetPropsById("hitos");
    expect(hitosWidgetProps?.isVisible).toBe(false);
  });

  it("displays POI summary when 'mostrarPuntosInteres' is true and POIs exist", () => {
    render(<Sidebar {...defaultProps} mostrarPuntosInteres={true} puntosInteres={mockPuntosInteres} />);
    
    expect(screen.getByText(/Parque/i)).toBeInTheDocument();
    expect(screen.getByText('2', { selector: 'ul.poi-list li span:last-child' })).toBeInTheDocument();
    expect(screen.getByText('1', { selector: 'ul.poi-list li span:last-child' })).toBeInTheDocument();

    const poiWidgetProps = getChartWidgetPropsById("puntos-interes");
    expect(poiWidgetProps?.chartData).toEqual([
      { name: "Parque", value: 2 },
      { name: "Restaurante", value: 1 },
    ]);
    expect(poiWidgetProps?.isVisible).toBe(true);
    expect(poiWidgetProps?.hasData).toBe(true);
  });

  it("shows 'no data' message for POIs when 'mostrarPuntosInteres' is true but no POIs", () => {
    render(<Sidebar {...defaultProps} mostrarPuntosInteres={true} puntosInteres={[]} />);
    
    const poiWidgetProps = getChartWidgetPropsById("puntos-interes");
    expect(poiWidgetProps?.isVisible).toBe(true);
    expect(poiWidgetProps?.hasData).toBe(false);
    expect(screen.getByText("No hay puntos de interés para mostrar en la ruta o están ocultos.")).toBeInTheDocument();
  });

  it("hides POI section when 'mostrarPuntosInteres' is false", () => {
    render(<Sidebar {...defaultProps} mostrarPuntosInteres={false} />);
    
    const poiWidgetProps = getChartWidgetPropsById("puntos-interes");
    expect(poiWidgetProps?.isVisible).toBe(false);
  });

  it("displays Age Group data when 'mostrarCirculos' is true and hitos exist", () => {
    render(<Sidebar {...defaultProps} mostrarCirculos={true} hitos={mockHitos} ageGroupData={mockAgeGroupData} />);
    
    const ageChartWidgetProps = getChartWidgetPropsById("franjas-etarias");
    expect(ageChartWidgetProps?.isVisible).toBe(true);
    expect(ageChartWidgetProps?.hasData).toBe(true);
    expect(ageChartWidgetProps?.chartData).toEqual(mockAgeGroupData);
    expect(screen.getByTestId("chart-widget-franjas-etarias")).toHaveTextContent(`Visitantes ${mockAgeGroupData[0].value + mockAgeGroupData[1].value}`);
  });

  it("shows 'no data' message for Age Group data when 'mostrarCirculos' is true but no hitos", () => {
    render(<Sidebar {...defaultProps} mostrarCirculos={true} hitos={[]} ageGroupData={mockAgeGroupData} />);
    
    const ageChartWidgetProps = getChartWidgetPropsById("franjas-etarias");
    expect(ageChartWidgetProps?.isVisible).toBe(true);
    expect(ageChartWidgetProps?.hasData).toBe(false);
    expect(screen.getByText("Los datos de franjas etarias están ocultos o no hay círculos en el mapa.")).toBeInTheDocument();
  });

  it("hides Age Group data when 'mostrarCirculos' is false", () => {
    render(<Sidebar {...defaultProps} mostrarCirculos={false} />);
    
    const ageChartWidgetProps = getChartWidgetPropsById("franjas-etarias");
    expect(ageChartWidgetProps?.isVisible).toBe(false);
  });

  it("displays Socioeconomic data when 'mostrarCirculos' is true and hitos exist", () => {
    render(<Sidebar {...defaultProps} mostrarCirculos={true} hitos={mockHitos} socioeconomicData={mockSocioeconomicData} />);
    
    const socioChartWidgetProps = getChartWidgetPropsById("nivel-socioeconomico");
    expect(socioChartWidgetProps?.isVisible).toBe(true);
    expect(socioChartWidgetProps?.hasData).toBe(true);
    expect(socioChartWidgetProps?.chartData).toEqual(mockSocioeconomicData);
  });

  it("shows 'no data' message for Socioeconomic data when 'mostrarCirculos' is true but no hitos", () => {
    render(<Sidebar {...defaultProps} mostrarCirculos={true} hitos={[]} socioeconomicData={mockSocioeconomicData} />);
    
    const socioChartWidgetProps = getChartWidgetPropsById("nivel-socioeconomico");
    expect(socioChartWidgetProps?.isVisible).toBe(true);
    expect(socioChartWidgetProps?.hasData).toBe(false);
    expect(screen.getByText("Los datos de nivel socioeconómico están ocultos o no hay círculos en el mapa.")).toBeInTheDocument();
  });

  it("hides Socioeconomic data when 'mostrarCirculos' is false", () => {
    render(<Sidebar {...defaultProps} mostrarCirculos={false} />);
    
    const socioChartWidgetProps = getChartWidgetPropsById("nivel-socioeconomico");
    expect(socioChartWidgetProps?.isVisible).toBe(false);
  });

  it("shows 'no data' message for Age Group when data is empty but conditions met", () => {
    render(<Sidebar {...defaultProps} mostrarCirculos={true} hitos={mockHitos} ageGroupData={[]} />);
    
    const ageChartWidgetProps = getChartWidgetPropsById("franjas-etarias");
    expect(ageChartWidgetProps?.isVisible).toBe(true);
    expect(ageChartWidgetProps?.hasData).toBe(false);
    expect(screen.getByText("Los datos de franjas etarias están ocultos o no hay círculos en el mapa.")).toBeInTheDocument();
  });
});