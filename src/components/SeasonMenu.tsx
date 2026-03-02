import { Button, Host, Menu, Text } from '@expo/ui/swift-ui'
import * as React from 'react'
import { useF1Data } from '@/src/context/F1DataContext'
import { useSeasonsQuery } from '@/src/hooks/useF1Queries'
import { font } from '@expo/ui/swift-ui/modifiers'

export default function SeasonContextMenu() {
  const { setSelectedSeason, selectedSeason } = useF1Data()

  const { data } = useSeasonsQuery()

  const renderOption = (option: string, index: number) => (
    <Button
      key={index}
      label={option}
      onPress={() => {
        setSelectedSeason(option)
      }}
    />
  )

  return (
    <Host matchContents>
      <Menu
        label={
          <Host style={{ width: 36, height: 36 }}>
            <Text modifiers={[font({ weight: 'bold' })]}>
              {selectedSeason.slice(2)}
            </Text>
          </Host>
        }
      >
        {data?.map((option: string, index: number) =>
          renderOption(option, index),
        )}
      </Menu>
    </Host>
  )
}
