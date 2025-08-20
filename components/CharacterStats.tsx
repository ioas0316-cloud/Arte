
import React from 'react';
import { CharacterStats, Item, ItemRarity } from '../types';
import Tooltip from './Tooltip';
import StatsRadarChart from './StatsRadarChart';
import { useLanguage } from '../localization';

interface StatsAndSkillsProps {
  stats: CharacterStats;
  appellation: string;
  onEditName: () => void;
}

const rarityColorMap: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: 'text-gray-300',
  [ItemRarity.UNCOMMON]: 'text-green-300',
  [ItemRarity.RARE]: 'text-blue-300',
  [ItemRarity.EPIC]: 'text-purple-300',
  [ItemRarity.LEGENDARY]: 'text-orange-300',
  [ItemRarity.MYTHIC]: 'text-yellow-300',
};

const calculateTotalStats = (stats: CharacterStats) => {
  const total = { ...stats.baseStats };
  
  Object.values(stats.equipment).forEach(item => {
    if (item && item.stats) {
      for (const [stat, value] of Object.entries(item.stats)) {
        if (value) {
          total[stat as keyof typeof total] += value;
        }
      }
    }
  });
  return total;
};

const EquipmentDisplay: React.FC<{ item: Item | null, slotName: string }> = ({ item, slotName }) => {
  const { t } = useLanguage();
  return (
      <div className="flex items-center justify-between bg-black/20 p-2 rounded-md">
        <span className="text-slate-400 text-sm">{slotName}</span>
        {item ? (
          <span className={`font-semibold text-sm ${rarityColorMap[item.rarity]}`}>{item.name}</span>
        ) : (
          <span className="text-gray-500 text-sm italic">{t('emptySlot')}</span>
        )}
      </div>
  )
};

const EmotionalStat: React.FC<{ value: number; children: React.ReactNode; color: string; }> = ({ value, children, color }) => (
    <div className={`flex flex-col items-center justify-center p-2 rounded-lg bg-black/20 w-full h-full`}>
        <div className={`h-6 w-6 mb-1 ${color}`}>
            {children}
        </div>
        <span className="text-lg font-bold text-white">{value}</span>
    </div>
);

const StatsAndSkills: React.FC<StatsAndSkillsProps> = ({ stats, appellation, onEditName }) => {
  const { t } = useLanguage();
  const xpPercentage = stats.expToNextLevel > 0 ? (stats.exp / stats.expToNextLevel) * 100 : 0;
  const totalStats = calculateTotalStats(stats);

  const statLabels = {
    strength: t('statStrength'),
    agility: t('statAgility'),
    knowledge: t('statKnowledge'),
    wisdom: t('statWisdom'),
    vitality: t('statVitality'),
  };

  const statDescriptions = {
    strength: t('descStrength'),
    agility: t('descAgility'),
    knowledge: t('descKnowledge'),
    wisdom: t('descWisdom'),
    vitality: t('descVitality'),
  };
  
  const emotionalStatTooltips = {
    interest: t('descInterest'),
    trust: t('descTrust'),
    doubt: t('descDoubt'),
    affection: t('descAffection'),
    resentment: t('descResentment'),
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-[var(--border-color)]">
      {/* Level, Appellation, EXP */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="font-bold text-xl text-purple-300" style={{ textShadow: '0 0 5px rgba(192, 132, 252, 0.7)' }}>
            Lv. {stats.level}
          </div>
          <div className="flex items-center gap-2 font-semibold text-lg text-slate-300">
            {t('appellationLabel')}: <span className="text-white font-bold">{appellation}</span>
            <Tooltip text={t('tooltipChangeAppellation')}>
                <button onClick={onEditName} className="text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                </button>
            </Tooltip>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm text-slate-300 mb-1" aria-live="polite">
            <span>EXP</span>
            <span>{stats.exp} / {stats.expToNextLevel}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5" role="progressbar" aria-valuenow={stats.exp} aria-valuemin={0} aria-valuemax={stats.expToNextLevel}>
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Emotional Stats */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">{t('emotionalStateTitle')}</h3>
        <div className="grid grid-cols-5 gap-2">
            <Tooltip text={emotionalStatTooltips.interest}>
                <EmotionalStat value={stats.emotionalStats.interest} color="text-teal-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </EmotionalStat>
            </Tooltip>
            <Tooltip text={emotionalStatTooltips.trust}>
                <EmotionalStat value={stats.emotionalStats.trust} color="text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </EmotionalStat>
            </Tooltip>
            <Tooltip text={emotionalStatTooltips.doubt}>
                <EmotionalStat value={stats.emotionalStats.doubt} color="text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </EmotionalStat>
            </Tooltip>
            <Tooltip text={emotionalStatTooltips.affection}>
                <EmotionalStat value={stats.emotionalStats.affection} color="text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                </EmotionalStat>
            </Tooltip>
            <Tooltip text={emotionalStatTooltips.resentment}>
                <EmotionalStat value={stats.emotionalStats.resentment} color="text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 17l-5-5 5-5" /></svg>
                </EmotionalStat>
            </Tooltip>
        </div>
      </div>

      <hr className="border-[var(--border-color)] my-4" />

      {/* Equipment */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">{t('equipmentTitle')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <EquipmentDisplay item={stats.equipment.weapon} slotName={t('slotWeapon')} />
          <EquipmentDisplay item={stats.equipment.armor} slotName={t('slotArmor')} />
          <EquipmentDisplay item={stats.equipment.accessory} slotName={t('slotAccessory')} />
        </div>
      </div>

      {/* Base Stats */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">{t('statsTitle')}</h3>
        <StatsRadarChart 
          baseStats={stats.baseStats}
          totalStats={totalStats}
          labels={statLabels}
        />
        <div className="mt-4">
            <div className="space-y-2">
                {Object.entries(statLabels).map(([key, label]) => (
                    <Tooltip key={key} text={statDescriptions[key as keyof typeof statDescriptions]}>
                        <div className="flex justify-between p-2 bg-black/20 rounded-md cursor-help">
                            <span className="font-semibold text-slate-300">{label}</span>
                            <span className="font-bold text-white">{totalStats[key as keyof typeof totalStats]}</span>
                        </div>
                    </Tooltip>
                ))}
            </div>
        </div>
      </div>

      {/* Skills */}
      {stats.skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-purple-300 mb-2">{t('skillsTitle')}</h3>
          <div className="flex flex-wrap gap-2">
            {stats.skills.map((skill, index) => (
              <span key={index} className="bg-slate-700 text-purple-200 text-sm font-medium px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsAndSkills;
