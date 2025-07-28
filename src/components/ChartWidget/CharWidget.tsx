import type {ChartWidgetProps} from '../../types';
import GenericBarChart from '../GenericBarChart/GenericBarChart';
import './CharWidget.scss'

const ChartWidget: React.FC<ChartWidgetProps> = ({
    title,
    headerLabel,
    isVisible,
    hasData,
    content,
    chartData,
    dataKey,
    categoryKey,
    barColors,
    noDataMessage,
}) => {
    return (
        <li className="chartWidget">
            <div className="chartWidget__widget">
                <div className="chartWidget__header">
                    <h3>{title}</h3>
                    {headerLabel && isVisible && hasData ? (
                        <span className="total-label">{headerLabel}</span>
                    ) : null}
                </div>
                {isVisible && hasData ? (
                    <>
                        {content}
                        {chartData && dataKey && categoryKey && (
                            <GenericBarChart
                              className="chartWidget__graphic"
                              data={chartData}
                              dataKey={dataKey}
                              categoryKey={categoryKey}
                              barColors={barColors}
                            />
                        )}
                    </>
                ) : (
                    noDataMessage
                )}
            </div>
        </li>
    );
};

export default ChartWidget;