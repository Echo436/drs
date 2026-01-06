import { Button, ContextMenu, Host, Text } from '@expo/ui/swift-ui'
import * as React from 'react'
import { useF1Data } from '@/context/F1DataContext'
import { useSeasonsQuery } from '@/hooks/useF1Queries'
import { font } from '@expo/ui/swift-ui/modifiers'

export default function SeasonContextMenu() {
  const {
    setSelectedSeason,
    selectedSeason,
  } = useF1Data()

  const { data } = useSeasonsQuery()

  const renderOption = (option: string, index: number) => (
    <Button
      key={index}
      onPress={() => {
        setSelectedSeason(option)
      }}
    >
      {option}
    </Button>
  )

  return (
    <Host>
      <ContextMenu>
        <ContextMenu.Items>
          {data?.map((option: string, index: number) =>
            renderOption(option, index),
          )}
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Host style={{ width: 36, height: 36 }}>
            <Text modifiers={[font({ weight: 'bold' })]}>
              {selectedSeason.slice(2)}
            </Text>
          </Host>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  )
}
