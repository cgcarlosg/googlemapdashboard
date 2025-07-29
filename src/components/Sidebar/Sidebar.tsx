/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import type { SidebarProps } from "../../types";
import "./Sidebar.scss";
import ChartWidget from "../ChartWidget/CharWidget";

const Sidebar: React.FC<SidebarProps> = ({
  puntosInteres,
  hitos,
  ageGroupData,
  socioeconomicData,
  mostrarHitos,
  mostrarPuntosInteres,
  mostrarCirculos,
}) => {
  const displayedPuntosInteres = useMemo(() => {
    return mostrarPuntosInteres ? puntosInteres : [];
  }, [mostrarPuntosInteres, puntosInteres]);

  const poiSummary = useMemo(() => {
    const summary: { [key: string]: number } = {};
    displayedPuntosInteres.forEach((poi) => {
      summary[poi.tipo] = (summary[poi.tipo] || 0) + 1;
    });
    return summary;
  }, [displayedPuntosInteres]);

  const poiIcons: { [key: string]: string } = {
    Parque: "🌳",
    Restaurante: "🍔",
    Tienda: "🏪",
  };

  const totalVisitors = ageGroupData.reduce(
    (sum, entry) => sum + entry.value,
    0
  );
  const showAgeSocioWidgets = mostrarCirculos && hitos.length > 0;

  const chartConfigs = [
    {
      id: "hitos",
      title: "Hitos en la Ruta",
      isVisible: mostrarHitos,
      hasData: hitos.length > 0,
      content: (
        <p>
          <strong>Total de Hitos:</strong> {hitos.length}
        </p>
      ),
      noDataMessage: (
        <p>No hay hitos generados para la ruta actual o están ocultos.</p>
      ),
    },
    {
      id: "puntos-interes",
      title: "Resumen de Puntos de Interés",
      isVisible: mostrarPuntosInteres,
      hasData: displayedPuntosInteres.length > 0,
      content: (
        <ul className="poi-list">
          {Object.entries(poiSummary).map(([tipo, count]) => (
            <li key={tipo}>
              <span>
                {poiIcons[tipo] || "❓"} {tipo}
              </span>
              <span>{count}</span>
            </li>
          ))}
        </ul>
      ),
      chartData: Object.keys(poiSummary).map((key) => ({
        name: key,
        value: poiSummary[key],
      })),
      dataKey: "value",
      categoryKey: "name",
      barColors: ["#FF5733", "#33FF57", "#3357FF"],
      chartHeight: 200,
      noDataMessage: (
        <p>No hay puntos de interés para mostrar en la ruta o están ocultos.</p>
      ),
    },
    {
      id: "franjas-etarias",
      title: "Franjas Etarias",
      isVisible: mostrarCirculos,
      hasData: showAgeSocioWidgets && ageGroupData.length > 0,
      headerLabel: `Visitantes ${totalVisitors}`,
      content: null,
      chartData: ageGroupData,
      dataKey: "value",
      categoryKey: "name",
      barColors: (entry: any) => entry.color,
      chartHeight: 200,
      noDataMessage: (
        <p>
          Los datos de franjas etarias están ocultos o no hay círculos en el
          mapa.
        </p>
      ),
    },
    {
      id: "nivel-socioeconomico",
      title: "Nivel Socioeconómico",
      isVisible: mostrarCirculos,
      hasData: showAgeSocioWidgets && socioeconomicData.length > 0,
      content: null,
      chartData: socioeconomicData,
      dataKey: "value",
      categoryKey: "name",
      barColors: (entry: any) => entry.color,
      chartHeight: 200,
      noDataMessage: (
        <p>
          Los datos de nivel socioeconómico están ocultos o no hay círculos en
          el mapa.
        </p>
      ),
    },
  ];

  return (
    <section className="sidebar">
      <ul className="sidebar__list">
        {chartConfigs.map((chart) => (
          <ChartWidget key={chart.id} {...chart} />
        ))}
      </ul>
    </section>
  );
};

export default Sidebar;
