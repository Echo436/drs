import React from 'react';
import { TabPageLayout } from '@/components/TabPageLayout';
import { t } from '@/i18n/utils';
import DriverList from './driver';
import ConstructorList from './constructor';

// 排名布局组件，使用通用TabPageLayout组件实现标签页切换功能
export default function GrandPrixLayout() {
    return (
        <TabPageLayout
            FirstPage={DriverList}
            SecondPage={ConstructorList}
            firstTabLabel={t('Drivers', 'tabs')}
            secondTabLabel={t('Teams', 'tabs')}
            initialTab="first"
            rightBottomText={t('points', 'tabs')}
        />
    )
}