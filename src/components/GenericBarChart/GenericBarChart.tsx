import type { GenericBarChartProps } from '../../types'
import './GenericBarChart.scss'
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

const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#0088FE', '#00C49F'];

const GenericBarChart: React.FC<GenericBarChartProps> = ({
    data,
    dataKey,
    categoryKey,
    barColors = defaultColors,
}) => {
    return (
        <ResponsiveContainer className="genericbarchart">
            <BarChart className="genericbarchart__bar"
                data={data}
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey={categoryKey} stroke="#555" />
                <Tooltip />
                <Bar dataKey={dataKey}>
                    {data.map((entry, index) => {
                        const color = typeof barColors === 'function' ? barColors(entry, index) : barColors[index % barColors.length];
                        return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default GenericBarChart;