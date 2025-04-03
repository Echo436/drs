import { Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { t } from '@/i18n/utils';
import MyTabBar from '@/components/TabBar'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <MyTabBar {...props} />}
      initialRouteName="grand-prix"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="grand-prix"
        options={{
          title: t('GrandPrix', 'tabs'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="flag.checkered" color={color} />,
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: t('Standings', 'tabs'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings', 'tabs'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
