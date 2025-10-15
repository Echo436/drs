import SeasonContextMenu from '@/components/SeasonContextMenu'
import CloseButton from '@/components/CloseButton'
import { t } from '@/i18n/utils'
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
          headerLeft: () => <SeasonContextMenu />,
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
    </Stack>
  )
}
