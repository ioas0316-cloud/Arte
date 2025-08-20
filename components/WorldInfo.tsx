

import React from 'react';
import { WorldState, Faction } from '../types';
import { useLanguage } from '../localization';

interface WorldInfoProps {
  worldState: WorldState;
}

const getRelationshipColor = (value: number): string => {
    if (value > 50) return 'text-cyan-400';
    if (value > 10) return 'text-green-400';
    if (value < -50) return 'text-red-500';
    if (value < -10) return 'text-orange-400';
    return 'text-slate-300';
}

const FactionDisplay: React.FC<{ faction: Faction }> = ({ faction }) => {
    const { t } = useLanguage();
    
    const getRelationshipText = (value: number): string => {
        if (value > 75) return t('relationAlly');
        if (value > 50) return t('relationFriendly');
        if (value > 25) return t('relationFavorable');
        if (value > -25) return t('relationNeutral');
        if (value < -75) return t('relationHostile');
        if (value < -50) return t('relationVeryHostile');
        if (value < -25) return t('relationUnfavorable');
        return t('relationNeutral');
    }

    return (
        <div className="flex justify-between items-center p-2 bg-black/20 rounded-md">
            <span className="font-semibold text-slate-200">{faction.name}</span>
            <span className={`font-bold ${getRelationshipColor(faction.relationship)}`} title={`${t('relationship')}: ${faction.relationship}`}>
                {getRelationshipText(faction.relationship)}
            </span>
        </div>
    );
};

const WorldInfo: React.FC<WorldInfoProps> = ({ worldState }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-black/60 p-4 rounded-lg border border-[var(--border-color)] mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.757 15.757a3 3 0 104.486 0M12 10.5h.01M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('panelTitleWorldInfo')}
        </h3>
        <div className="text-right">
            <div className="font-bold text-lg text-white">Day {worldState.day}</div>
            <div className="text-sm text-slate-300">{worldState.season}</div>
        </div>
      </div>
      
      <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
        {/* Factions */}
        <div>
            <h4 className="font-semibold text-purple-200 mb-2">{t('factionDynamics')}</h4>
            <div className="space-y-2">
                {worldState.factions.map(faction => <FactionDisplay key={faction.id} faction={faction} />)}
            </div>
        </div>

        {/* Events */}
        {worldState.events.filter(e => !e.isCompleted).length > 0 && (
            <div>
                 <h4 className="font-semibold text-purple-200 mb-2 mt-4">{t('majorEvents')}</h4>
                 <div className="space-y-2">
                    {worldState.events.filter(e => !e.isCompleted).map(event => (
                        <div key={event.id} className="p-2 bg-black/20 rounded-md">
                            <p className="font-semibold text-purple-300">{event.title}</p>
                            <p className="text-sm text-slate-300 italic">"{event.description}"</p>
                        </div>
                    ))}
                 </div>
            </div>
        )}
      </div>

    </div>
  );
};

export default WorldInfo;