import React from 'react';
import { TabPageLayout } from '@/components/TabPageLayout';
import { t } from '@/i18n/utils';
import Current from './current';
import Season from './season';

// 大奖赛布局组件，使用通用TabPageLayout组件实现标签页切换功能
export default function GrandPrixLayout() {
    return (
        <TabPageLayout
            FirstPage={Current}
            SecondPage={Season}
            firstTabLabel={t('Current', 'tabs')}
            secondTabLabel={t('Season', 'tabs')}
            initialTab="first"
        />
    )
}