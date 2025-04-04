import React from 'react';
import { TabPageLayout } from '@/components/TabPageLayout';
import { t } from '@/i18n/utils';
import Season from './season';
import Settings from '../settings/_layout';
import GrandPrixDetail from '@/app/race/[raceId]';

// 大奖赛布局组件，使用通用TabPageLayout组件实现标签页切换功能
export default function GrandPrixLayout() {
    return (
        <TabPageLayout
            FirstPage={() => <GrandPrixDetail isCurrentPage={true} />}
            // FirstPage={Settings}
            SecondPage={Season}
            firstTabLabel={t('Current', 'tabs')}
            secondTabLabel={t('Season', 'tabs')}
            initialTab="first"
        />
    )
}