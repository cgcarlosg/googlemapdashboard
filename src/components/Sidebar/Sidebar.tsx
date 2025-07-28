import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import type { SidebarProps } from '../../types';
import './Sidebar.scss';

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
        displayedPuntosInteres.forEach(poi => {
            summary[poi.tipo] = (summary[poi.tipo] || 0) + 1;
        });
        return summary;
    }, [displayedPuntosInteres]);

    const poiIcons: { [key: string]: string } = {
        'Parque': '🌳',
        'Restaurante': '🍔',
        'Tienda': '🏪',
    };

    const totalVisitors = ageGroupData.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <section className="sidebar">
            {mostrarHitos && (
                <div className="widget">
                    <h3>Hitos en la Ruta</h3>
                    <p><strong>Total de Hitos:</strong> {hitos.length}</p>
                    {hitos.length === 0 && <p>No hay hitos generados para la ruta actual.</p>}
                </div>
            )}

            {mostrarPuntosInteres ? (
                <div className="widget">
                    <h3>Resumen de Puntos de Interés</h3>
                    <p><strong>Total de POIs:</strong> {displayedPuntosInteres.length}</p>
                    {displayedPuntosInteres.length > 0 ? (
                        <>
                            <ul className="poi-list">
                                {Object.entries(poiSummary).map(([tipo, count]) => (
                                    <li key={tipo}>
                                        <span>{poiIcons[tipo] || '❓'} {tipo}</span>
                                        <span>{count}</span>
                                    </li>
                                ))}
                            </ul>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={Object.keys(poiSummary).map(key => ({ name: key, value: poiSummary[key] }))}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" stroke="#555" />
                                    <Tooltip />
                                    <Bar dataKey="value">
                                        {Object.keys(poiSummary).map((_key, index) => (
                                            <Cell key={`cell-${index}`} fill={['#FF5733', '#33FF57', '#3357FF'][index % 3]} /> // Colores de ejemplo
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    ) : (
                        <p>No hay puntos de interés para mostrar en la ruta o están ocultos.</p>
                    )}
                </div>
            ) : (
                <div className="widget">
                    <h3>Resumen de Puntos de Interés</h3>
                    <p>Los puntos de interés están actualmente ocultos.</p>
                </div>
            )}

 {mostrarCirculos && (
            <div className="widget">
                <div className="widget-header">
                    <h3>Franjas Etarias</h3>
                    <span className="total-label">Visitantes {totalVisitors}</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={ageGroupData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="#555" />
                        <Tooltip />
                        <Bar dataKey="value">
                            {ageGroupData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
 )}
 {mostrarCirculos && (
            <div className="widget">
                <h3>Nivel Socioeconómico</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={socioeconomicData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="#555" />
                        <Tooltip />
                        <Bar dataKey="value">
                            {socioeconomicData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
              )}
        </section>
    );
};

export default Sidebar;