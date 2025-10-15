import React from 'react'
import { AppleMaps } from 'expo-maps'
import { useLocalSearchParams } from 'expo-router'

export default function Map() {
  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string
    longitude: string
  }>()

  const lat = latitude ? Number(latitude) : 0
  const lng = longitude ? Number(longitude) : 0

  return (
    <AppleMaps.View
      style={{ flex: 1 }}
      cameraPosition={{
        coordinates: {
          latitude: lat,
          longitude: lng,
        },
        zoom: 14,
      }}
      uiSettings={{
        myLocationButtonEnabled: false,
      }}
    />
  )
}
