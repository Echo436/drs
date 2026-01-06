import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { F1DataProvider } from '@/context/F1DataContext'
import { I18nProvider } from '@/i18n/I18nProvider'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs'
import { t } from '@/i18n/utils'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({
  fade: true,
})

const queryClient = new QueryClient()

export default function RootLayout() {
  const [loaded] = useFonts({
    // 添加字体需要在这里配置字体名称和对应的字体文件路径
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Formula1-Bold': require('../assets/fonts/Formula1-Bold_web_0.ttf'),
    'Formula1-Regular': require('../assets/fonts/Formula1-Regular_web_0.ttf'),
    'Formula1-Wide': require('../assets/fonts/Formula1-Wide_web_0.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync()
      }, 5000)
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <F1DataProvider>
          <I18nProvider>
            <NativeTabs>
              <NativeTabs.Trigger name="season">
                <Label>{t('Season', 'tabs')}</Label>
                <Icon sf="calendar" />
              </NativeTabs.Trigger>
              <NativeTabs.Trigger name="drivers">
                <Label>{t('Drivers', 'tabs')}</Label>
                <Icon sf="person.2" />
              </NativeTabs.Trigger>
              <NativeTabs.Trigger name="constructors">
                <Label>{t('Teams', 'tabs')}</Label>
                <Icon sf="trophy" />
              </NativeTabs.Trigger>
              {/* <NativeTabs.Trigger name="settings">
              <Icon sf="gear" drawable="custom_settings_drawable" />
              <Label>{t('settings', 'tabs')}</Label>
            </NativeTabs.Trigger> */}
            </NativeTabs>
          </I18nProvider>
        </F1DataProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
