import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import storage from '@/storage/storage';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import { setPrimaryColor } from '@/storage/themeSlice';

import { t } from '@/i18n/utils';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const primaryColor = useAppSelector(state => state.theme.primaryColor);
  const dispatch = useAppDispatch();


  return (
    <Tabs
      initialRouteName="grand-prix"
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveTintColor: primaryColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
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
