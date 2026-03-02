import SeasonMenu from '@/src/components/SeasonMenu'
import CloseButton from '@/src/components/CloseButton'
import { t } from '@/src/i18n/utils'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'

export default function HomeLayout() {
  const theme = useColorScheme()

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          headerTransparent: true,
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          title: t('Season', 'tabs'),
          headerLeft: () => <SeasonMenu />,
        }}
      />
      <Stack.Screen
        name="mapModal"
        options={{
          presentation: 'modal',
          headerTransparent: true,
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          title: '',
          headerRight: () => <CloseButton />,
        }}
      />
      <Stack.Screen
        name="circuit"
        options={{
          presentation: 'modal',
          headerTransparent: true,
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          title: '',
          headerRight: () => <CloseButton />,
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          presentation: 'modal',
          headerTransparent: true,
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          title: '',
          headerRight: () => <CloseButton />,
        }}
      />
    </Stack>
  )
}
