import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, useColorScheme, ScrollView } from "react-native";
import { Circuit, Driver, Team } from "@/context/F1DataContext";
import { Stack, useLocalSearchParams } from "expo-router";
import { layoutStyles } from "@/components/ui/Styles";
import { getCircuitDetailImage } from "@/constants/CircuitImages";
import { ThemedText } from "@/components/ThemedText";
import { t, translateName } from "@/i18n/utils";

export default function CircuitDetail() {
  const theme = useColorScheme();
  const { circuitId, initialData } = useLocalSearchParams<{
    circuitId: string,
    initialData: string,
  }>()

  const circuitInitData = initialData ? JSON.parse(initialData) as Circuit : null
  const [driverData, setDriverData] = useState<Driver | null>(null)
  const [teamData, setTeamData] = useState<Team | null>(null)

  const fetchDriverAndTeam = () => {
    fetch(`https://f1api.dev/api/drivers/${circuitInitData?.fastestLapDriverId}`)
      .then(response => response.json())
      .then(data => {
        setDriverData(data.driver[0]);
      })
    fetch(`https://f1api.dev/api/teams/${circuitInitData?.fastestLapTeamId}`)
      .then(response => response.json())
      .then(data => {
        setTeamData(data.team[0]);
      })
  }

  useEffect(() => {
    if (initialData && initialData !== 'null' && initialData !== 'undefined') {
      fetchDriverAndTeam();
    } else {
      return;
    }
  }, [initialData])

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTintColor: theme === "dark" ? "white" : "black",
          title: t(circuitInitData?.circuitName || '', 'circuit-name'),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[layoutStyles.listContainer, { backgroundColor: theme === 'dark' ? 'black' : 'white' }]}
      >
        <View>
          <Image
            style={{ width: Dimensions.get('window').width - 30, height: 250 }}
            resizeMode="contain"
            source={getCircuitDetailImage(circuitId)}
          />
        </View>
        <View>
          <View>
            <ThemedText>
              第一场比赛{circuitInitData?.firstParticipationYear}
            </ThemedText>
            <ThemedText>
              赛道记录{circuitInitData?.lapRecord}
              车手{translateName([driverData?.name || '', driverData?.surname || ''])}
              车队{t(teamData?.teamName || circuitInitData?.fastestLapTeamId || '', 'team')}
            </ThemedText>
            <ThemedText>
              {circuitInitData?.fastestLapYear}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </>
  )
}