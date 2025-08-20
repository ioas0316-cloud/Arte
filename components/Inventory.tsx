
import React from 'react';
import { Item, BaseStats, ItemRarity, ItemType } from '../types';
import { useLanguage } from '../localization';

const rarityTextMap: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: 'rarity-common',
  [ItemRarity.UNCOMMON]: 'rarity-uncommon',
  [ItemRarity.RARE]: 'rarity-rare',
  [ItemRarity.EPIC]: 'rarity-epic',
  [ItemRarity.LEGENDARY]: 'rarity-legendary',
  [ItemRarity.MYTHIC]: 'rarity-mythic',
};

const StatRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-400">{label}:</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

const ItemTooltip: React.FC<{ item: Item }> = ({ item }) => {
  const { t } = useLanguage();
  
  const typeTextMap: Record<ItemType, string> = {
    [ItemType.EQUIPMENT]: t('itemTypeEquipment'),
    [ItemType.CONSUMABLE]: t('itemTypeConsumable'),
    [ItemType.MATERIAL]: t('itemTypeMaterial'),
    [ItemType.QUEST]: t('itemTypeQuest'),
    [ItemType.ARTIFACT]: t('itemTypeArtifact'),
  };

  const statLabelMap = {
    strength: t('statStrength'),
    agility: t('statAgility'),
    knowledge: t('statKnowledge'),
    wisdom: t('statWisdom'),
    vitality: t('statVitality'),
  };

  return (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-[var(--border-color)] rounded-lg shadow-xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h4 className={`text-lg font-bold ${rarityTextMap[item.rarity]}`}>{item.name}</h4>
        <p className="text-xs text-slate-400 mb-2">{typeTextMap[item.type]} · {item.rarity.toUpperCase()}</p>
        <p className="text-sm text-slate-300 mb-3 italic">"{item.description}"</p>
        
        {item.stats && (
          <div className="space-y-1 border-t border-slate-700 pt-2 mb-2">
            {Object.entries(item.stats).map(([stat, value]) => (
              value ? <StatRow key={stat} label={statLabelMap[stat as keyof typeof statLabelMap]} value={`+${value}`} /> : null
            ))}
          </div>
        )}

        {item.effects && item.effects.length > 0 && (
           <div className="space-y-1 border-t border-slate-700 pt-2 mb-2">
             {item.effects.map((effect, index) => (
                <p key={index} className="text-sm text-green-400">{effect}</p>
             ))}
           </div>
        )}

        <div className="border-t border-slate-700 pt-2 mt-2">
            <StatRow label={t('itemValue')} value={`${item.goldValue} Gold`} />
        </div>
      </div>
  )
};


const InventoryItem: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <div className="relative group">
      <div className={`w-16 h-16 bg-black/30 rounded-md border-2 cursor-pointer flex items-center justify-center ${rarityTextMap[item.rarity]}`}>
        <span className="text-2xl">?</span>
      </div>
      <ItemTooltip item={item} />
    </div>
  );
};


const Inventory: React.FC<{ inventory: Item[]; gold: number }> = ({ inventory, gold }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-black/60 p-4 rounded-lg border border-[var(--border-color)]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {t('panelTitleInventory')}
        </h3>
        <div className="flex items-center gap-2 text-yellow-300 text-lg font-bold">
          <span>{gold}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-color-secondary)]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 004.998 0V7.15c.22.07.412.164.567.267C15.165 7.9 16 8.9 16 10c0 1.1-.835 2.1-1.433 2.582-.155.103-.346.196-.567.267v1.698a2.5 2.5 0 00-4.998 0v-1.698c-.22-.07-.412.164-.567-.267C4.835 12.1 4 11.1 4 10c0-1.1.835-2.1 1.433-2.582zM10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="max-h-40 overflow-y-auto pr-2">
        {inventory.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {inventory.map((item) => (
              <InventoryItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-center py-6">{t('inventoryEmpty')}</p>
        )}
      </div>
    </div>
  );
};

export default Inventory;