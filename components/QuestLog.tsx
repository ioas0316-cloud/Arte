
import React from 'react';
import { Quest, Item } from '../types';
import { useLanguage } from '../localization';

interface QuestLogProps {
  quests: Quest[];
}

const RewardItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-sm bg-slate-700/50 px-2 py-1 rounded-md text-slate-300">
        <span className="font-semibold text-white">{label}:</span> {value}
    </div>
);

const QuestLog: React.FC<QuestLogProps> = ({ quests }) => {
  const { t } = useLanguage();

  const getStatusStyles = (status: Quest['status']): { icon: string; color: string; text: string } => {
    switch (status) {
      case 'active':
        return { icon: '⏳', color: 'border-yellow-500', text: t('questStatusActive') };
      case 'completed':
        return { icon: '✅', color: 'border-green-500', text: t('questStatusCompleted') };
      case 'failed':
        return { icon: '❌', color: 'border-red-500', text: t('questStatusFailed') };
      default:
        return { icon: '❔', color: 'border-gray-500', text: t('questStatusUnknown') };
    }
  };

  return (
    <div className="bg-black/60 p-4 rounded-lg border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        {t('panelTitleQuests')}
      </h3>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {quests.length > 0 ? (
          quests.map((quest) => {
            const { icon, color, text } = getStatusStyles(quest.status);
            return (
              <div key={quest.id} className={`p-4 bg-black/30 rounded-lg border-l-4 ${color}`}>
                <header className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-xl text-purple-200">{quest.title}</h4>
                    <p className="text-sm text-slate-300 italic">"{quest.description}"</p>
                  </div>
                  <span className="text-sm font-semibold bg-slate-700/80 px-3 py-1 rounded-full text-white">{icon} {text}</span>
                </header>
                
                <div className="my-3">
                  <h5 className="font-semibold text-slate-200 mb-1">{t('questObjectives')}:</h5>
                  <ul className="space-y-1">
                    {quest.objectives.map((obj, index) => (
                      <li key={index} className="flex items-center gap-2 text-slate-300">
                        <input type="checkbox" checked={obj.isCompleted} readOnly className="form-checkbox h-4 w-4 rounded bg-slate-600 border-slate-500 text-purple-500 focus:ring-0 cursor-default" />
                        <span>{obj.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {quest.rewards && quest.status === 'completed' && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                        <h5 className="font-semibold text-slate-200 mb-2">{t('questRewards')}:</h5>
                        <div className="flex flex-wrap gap-2">
                            {quest.rewards.exp && <RewardItem label={t('rewardExp')} value={quest.rewards.exp} />}
                            {quest.rewards.gold && <RewardItem label={t('rewardGold')} value={quest.rewards.gold} />}
                            {quest.rewards.items?.map(item => (
                                <RewardItem key={item.id} label={t('rewardItem')} value={item.name} />
                            ))}
                        </div>
                    </div>
                )}

              </div>
            );
          })
        ) : (
          <p className="text-slate-400 italic text-center py-10">{t('questLogEmpty')}</p>
        )}
      </div>
    </div>
  );
};

export default QuestLog;