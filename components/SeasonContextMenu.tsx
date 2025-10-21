import { Button, ContextMenu, Host, Text } from '@expo/ui/swift-ui'
import * as React from 'react'
import { useF1Data } from '@/context/F1DataContext'

export default function SeasonContextMenu() {
  const {
    clearGrandPrixList,
    clearDriverList,
    clearConstructorList,
    setSelectedSeason,
    fetchGPListData,
    seasons,
    selectedSeason,
  } = useF1Data()

  const renderOption = (option: { season: string }, index: number) => (
    <Button
      key={index}
      onPress={() => {
        setSelectedSeason(option.season)
        clearGrandPrixList()
        clearDriverList()
        clearConstructorList()
        fetchGPListData(option.season)
      }}
    >
      {option.season}
    </Button>
  )

  return (
    <Host>
      <ContextMenu>
        <ContextMenu.Items>
          {seasons.map((option, index) => renderOption(option, index))}
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Host style={{ width: 36, height: 36 }}>
            <Text weight="bold">{selectedSeason.slice(2)}</Text>
          </Host>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  )
}
