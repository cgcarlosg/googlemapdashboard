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

const Sidebar: React.FC<SidebarProps> = ({ puntosInteres, ageGroupData, socioeconomicData }) => {
    const poiSummary = useMemo(() => {
        const summary: { [key: string]: number } = {};
        puntosInteres.forEach(poi => {
            summary[poi.tipo] = (summary[poi.tipo] || 0) + 1;
        });
        return summary;
    }, [puntosInteres]);

    const poiIcons: { [key: string]: string } = {
        'Parque': '🌳',
        'Restaurante': '🍔',
        'Tienda': '🏪',
    };
    
    const totalVisitors = ageGroupData.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <section className="sidebar">
            <div className="widget">
                <h3>Resumen de Puntos de Interés</h3>
                <p><strong>Total de POIs:</strong> {puntosInteres.length}</p>
                <ul className="poi-list">
                    {Object.entries(poiSummary).map(([tipo, count]) => (
                        <li key={tipo}>
                            <span>{poiIcons[tipo] || '❓'} {tipo}</span>
                            <span>{count}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Widget: Gráfico de Franjas Etarias */}
            <div className="widget">
                <div className="widget-header">
                    <h3>Franjas Etarias</h3>
                    <span className="total-label">Visitantes {totalVisitors}</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={ageGroupData} // Usamos los datos de las props
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

            {/* Widget: Gráfico de Nivel Socioeconómico */}
            <div className="widget">
                <h3>Nivel Socioeconómico</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={socioeconomicData} // Usamos los datos de las props
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
        </section>
    );
};

export default Sidebar;
