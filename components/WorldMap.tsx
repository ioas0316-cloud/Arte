

import React from 'react';
import { WorldState } from '../types';
import Tooltip from './Tooltip';
import { useLanguage } from '../localization';

interface WorldMapProps {
  worldState: WorldState;
}

// Pre-defined coordinates for locations on the map SVG
// Note: These IDs now need to match both KO and EN location IDs.
const locationCoordinates: Record<string, { cx: number; cy: number }> = {
  white_laboratory: { cx: 120, cy: 180 },
  whispering_valley: { cx: 160, cy: 120 },
  dragons_tooth_peaks: { cx: 250, cy: 80 },
  sea_of_clouds: { cx: 260, cy: 50 },
  eltz_castle: { cx: 70, cy: 90 },
};

const WorldMap: React.FC<WorldMapProps> = ({ worldState }) => {
  const { t } = useLanguage();
  const { locations, currentLocationId } = worldState;

  return (
    <div className="bg-black/60 p-4 rounded-lg border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l6.553 3.276A1 1 0 0021 19.382V8.618a1 1 0 00-.553-.894L15 5m0 12V5m0 0l6 3" />
        </svg>
        {t('worldMapTitle')}
      </h3>
      <div className="aspect-video w-full bg-slate-900/50 rounded-md p-2 overflow-hidden">
        <svg viewBox="0 0 350 250" className="w-full h-full">
            {/* Background Texture/Map elements */}
            <path d="M50,220 C-50,150 150,-50 250,100 S400,250 300,200 Z" fill="rgba(167, 139, 250, 0.05)" stroke="rgba(167, 139, 250, 0.1)" />
            <path d="M20,50 C80,10 150,100 80,180 S-20,150 20,50 Z" fill="rgba(167, 139, 250, 0.08)" stroke="rgba(167, 139, 250, 0.15)" />

            {/* Location Markers */}
            {locations.map(loc => {
                const coords = locationCoordinates[loc.id];
                if (!coords) return null;

                const isCurrent = loc.id === currentLocationId;

                return (
                    <g key={loc.id}>
                        <Tooltip text={loc.name}>
                            <circle 
                                cx={coords.cx}
                                cy={coords.cy}
                                r={isCurrent ? 8 : 5}
                                fill={isCurrent ? 'var(--accent-color-secondary)' : 'var(--accent-color)'}
                                stroke={isCurrent ? 'white' : 'rgba(255,255,255,0.5)'}
                                strokeWidth="1.5"
                                className="cursor-pointer transition-all duration-300"
                            />
                        </Tooltip>
                        {isCurrent && (
                            <circle 
                                cx={coords.cx}
                                cy={coords.cy}
                                r="12"
                                fill="none"
                                stroke="var(--accent-color-secondary)"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                className="animate-slow-spin"
                            />
                        )}
                    </g>
                )
            })}
        </svg>
      </div>
    </div>
  );
};

export default WorldMap;