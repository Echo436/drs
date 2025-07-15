import { Tabs } from '@/components/bottom-tabs';
import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { t } from '@/i18n/utils';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="grand-prix"
      screenOptions={{
        // headerShown: false,
      }}
    >
      <Tabs.Screen
        name="grand-prix"
        options={{
          title: t('GrandPrix', 'tabs'),
          tabBarIcon: () => ({ sfSymbol: 'flag.checkered' }),
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: t('Standings', 'tabs'),
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
      {/* <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      /> */}
    </Tabs>
  );
}
