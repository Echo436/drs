import React from 'react';
import { TabPageLayout } from '@/components/TabPageLayout';
import { t } from '@/i18n/utils';
import Season from './season';
import GrandPrixDetail from '@/app/race/[round]';
import { useF1Data } from '@/context/F1DataContext';

// 大奖赛布局组件，使用通用TabPageLayout组件实现标签页切换功能
export default function GrandPrixLayout() {
    const { currentRound, grandPrixList } = useF1Data();
    const currentRace = grandPrixList.find((race) => {
        if (race.round == currentRound) {
            return race;
        }
    })
    return (
        <TabPageLayout
            FirstPage={() => <GrandPrixDetail isCurrentPage={true} currentRound={currentRound} currentRace={currentRace}/>}
            SecondPage={Season}
            firstTabLabel={t('Current', 'tabs')}
            secondTabLabel={t('Season', 'tabs')}
            initialTab="first"
        />
    )
}