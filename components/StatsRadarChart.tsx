
import React from 'react';
import { BaseStats } from '../types';
import Tooltip from './Tooltip';
import { useLanguage } from '../localization';

interface StatsRadarChartProps {
  baseStats: BaseStats;
  totalStats: BaseStats;
  labels: { [key in keyof BaseStats]: string };
  maxStatValue?: number;
}

const StatsRadarChart: React.FC<StatsRadarChartProps> = ({
  baseStats,
  totalStats,
  labels,
  maxStatValue = 30, // Default max value, can be adjusted
}) => {
  const { t } = useLanguage();
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;
  const numAxes = Object.keys(baseStats).length;

  const statKeys = Object.keys(baseStats) as (keyof BaseStats)[];

  // Function to calculate point coordinates
  const getPoint = (stat: keyof BaseStats, value: number) => {
    const index = statKeys.indexOf(stat);
    const angle = (index / numAxes) * 2 * Math.PI - Math.PI / 2; // Start from top
    const statRadius = (Math.min(value, maxStatValue) / maxStatValue) * radius;
    const x = center + statRadius * Math.cos(angle);
    const y = center + statRadius * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points string
  const getPolygonPoints = (stats: BaseStats) => {
    return statKeys
      .map(key => {
        const point = getPoint(key, stats[key]);
        return `${point.x},${point.y}`;
      })
      .join(' ');
  };

  const basePoints = getPolygonPoints(baseStats);
  const totalPoints = getPolygonPoints(totalStats);

  // Grid lines
  const gridLevels = 4;
  const gridLines = Array.from({ length: gridLevels }).map((_, i) => {
    const levelRadius = (radius / gridLevels) * (i + 1);
    const points = statKeys
      .map((_, j) => {
        const angle = (j / numAxes) * 2 * Math.PI - Math.PI / 2;
        const x = center + levelRadius * Math.cos(angle);
        const y = center + levelRadius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
    return <polygon key={i} points={points} fill="none" stroke="rgba(167, 139, 250, 0.1)" strokeWidth="1" />;
  });

  // Axes lines
  const axes = statKeys.map((key, i) => {
    const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return <line key={key} x1={center} y1={center} x2={x} y2={y} stroke="rgba(167, 139, 250, 0.2)" strokeWidth="1" />;
  });

  // Stat Labels
  const statLabels = statKeys.map((key, i) => {
    const angle = (i / numAxes) * 2 * Math.PI - Math.PI / 2;
    const labelRadius = radius * 1.15;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return (
      <text
        key={key}
        x={x}
        y={y}
        fill="var(--accent-color)"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {labels[key]}
      </text>
    );
  });
  
  // Data points for tooltips
  const dataPoints = statKeys.map(key => {
    const point = getPoint(key, totalStats[key]);
    const bonus = totalStats[key] - baseStats[key];
    const tooltipText = `${labels[key]}: ${totalStats[key]} (${t('baseStatAbbr')} ${baseStats[key]} + ${t('equipStatAbbr')} ${bonus})`;

    return (
      <Tooltip key={key} text={tooltipText}>
        <circle cx={point.x} cy={point.y} r="4" fill="var(--accent-color)" className="cursor-pointer" />
      </Tooltip>
    );
  });

  return (
    <div className="flex flex-col items-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g>
                {gridLines}
                {axes}
                <polygon points={basePoints} fill="rgba(255, 255, 255, 0.2)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
                <polygon points={totalPoints} fill="rgba(167, 139, 250, 0.4)" stroke="var(--accent-color)" strokeWidth="2" />
                {statLabels}
                {dataPoints}
            </g>
        </svg>
        <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400/40 border border-purple-400"></div>
                <span>{t('totalStats')}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/20 border border-white/50"></div>
                <span>{t('baseStats')}</span>
            </div>
        </div>
    </div>
  );
};

export default StatsRadarChart;
