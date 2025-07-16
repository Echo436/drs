import { Tabs } from '@/components/bottom-tabs';
import React from 'react';

import { t } from '@/i18n/utils';

export default function TabLayout() {
  return (
    <Tabs
      // initialRouteName="season"
      // screenOptions={{
      //   // headerShown: false,
      // }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('Season', 'tabs'),
          tabBarIcon: () => ({ sfSymbol: 'calendar' }),
        }}
      />
      <Tabs.Screen
        name="drivers"
        options={{
          title: t('Drivers', 'tabs'),
          tabBarIcon: () => ({ sfSymbol: 'person.2' }),
        }}
      />
      <Tabs.Screen
        name="constructors"
        options={{
          title: t('Teams', 'tabs'),
          tabBarIcon: () => ({ sfSymbol: 'trophy' }),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings', 'tabs'),
          tabBarIcon: () => ({ sfSymbol: 'gear' }),
        }}
      />
    </Tabs>
  );
}
