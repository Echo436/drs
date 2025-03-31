import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';
import { F1DataProvider } from '@/context/F1DataContext';
import { I18nProvider } from '@/i18n/I18nProvider';

import store from '@/storage/configureStore';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks';
import { setPrimaryColor } from '@/storage/themeSlice';

import storage from '@/storage/storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function ThemeWrapper() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 加载持久化存储的强调色
    storage.load({key: 'primary-color'}).then(res => {
      if (res) {
        dispatch(setPrimaryColor(res));
      }
    })
  }, [dispatch]);

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+Stackound" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    // 添加字体需要在这里配置字体名称和对应的字体文件路径
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Formula1-Bold': require('../assets/fonts/Formula1-Bold_web_0.ttf'),
    'Formula1-Regular': require('../assets/fonts/Formula1-Regular_web_0.ttf'),
    'Formula1-Wide': require('../assets/fonts/Formula1-Wide_web_0.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <F1DataProvider>
          <I18nProvider>
            <ThemeWrapper />
          </I18nProvider>
        </F1DataProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
