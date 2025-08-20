import React, { useState, useEffect, useMemo } from 'react';
import { WorldState, Location } from '../types';

interface DynamicBackgroundProps {
  worldState: WorldState;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ worldState }) => {
  const { locations, currentLocationId } = worldState;
  
  const currentBgUrl = useMemo(() => {
    const currentLocation = locations.find(loc => loc.id === currentLocationId);
    return currentLocation ? currentLocation.backgroundUrl : '';
  }, [locations, currentLocationId]);

  const [backgrounds, setBackgrounds] = useState<string[]>([currentBgUrl]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  useEffect(() => {
    // Preload images
    locations.forEach(loc => {
      const img = new Image();
      img.src = loc.backgroundUrl;
    });
  }, [locations]);

  useEffect(() => {
    if (currentBgUrl && backgrounds[activeBgIndex] !== currentBgUrl) {
      const newIndex = (activeBgIndex + 1) % 2;
      const newBackgrounds = [...backgrounds];
      newBackgrounds[newIndex] = currentBgUrl;
      
      setBackgrounds(newBackgrounds);
      setActiveBgIndex(newIndex);
    }
  }, [currentBgUrl, backgrounds, activeBgIndex]);

  // Ensure we always have two background divs for the transition effect
  const bg1 = backgrounds[0] || '';
  const bg2 = backgrounds.length > 1 ? backgrounds[1] : bg1;

  return (
    <>
      <div
        className="immersive-background absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        style={{ 
          backgroundImage: `url(${bg1})`,
          opacity: activeBgIndex === 0 ? 1 : 0,
        }}
      />
      <div
        className="immersive-background absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        style={{ 
          backgroundImage: `url(${bg2})`,
          opacity: activeBgIndex === 1 ? 1 : 0,
        }}
      />
    </>
  );
};

export default DynamicBackground;