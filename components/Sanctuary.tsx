

import React from 'react';
import { Item, ItemRarity } from '../types';
import { useLanguage } from '../localization';

interface SanctuaryProps {
  sanctuary: Item[];
}

const rarityColorMap: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: 'border-gray-500',
  [ItemRarity.UNCOMMON]: 'border-green-500',
  [ItemRarity.RARE]: 'border-blue-500',
  [ItemRarity.EPIC]: 'border-purple-500',
  [ItemRarity.LEGENDARY]: 'border-orange-500',
  [ItemRarity.MYTHIC]: 'border-yellow-400',
};

const rarityTextColorMap: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: 'text-gray-300',
  [ItemRarity.UNCOMMON]: 'text-green-300',
  [ItemRarity.RARE]: 'text-blue-300',
  [ItemRarity.EPIC]: 'text-purple-300',
  [ItemRarity.LEGENDARY]: 'text-orange-300',
  [ItemRarity.MYTHIC]: 'text-yellow-300',
};

const Sanctuary: React.FC<SanctuaryProps> = ({ sanctuary }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-black/60 p-4 rounded-lg border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0118 17.657c-1.566 1.566-2.343 3-4.657 1C11 18.5 9 19 7.343 17.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 14.121A3 3 0 1014.12 9.88l-4.242 4.242z" />
        </svg>
        {t('panelTitleSanctuary')}
      </h3>
      <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {sanctuary.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sanctuary.map((item) => (
              <div key={item.id} className={`p-3 bg-black/30 rounded-lg border-l-4 ${rarityColorMap[item.rarity]}`}>
                <h4 className={`font-bold text-lg ${rarityTextColorMap[item.rarity]}`}>{item.name}</h4>
                <p className="text-sm text-slate-300 italic">"{item.description}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-10">{t('sanctuaryEmpty')}</p>
        )}
      </div>
    </div>
  );
};

export default Sanctuary;