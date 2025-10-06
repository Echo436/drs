import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, useColorScheme, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Circuit, Driver, Team } from "@/context/F1DataContext";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { layoutStyles, cardStyles } from "@/components/ui/Styles";
import { getCircuitDetailImage } from "@/constants/CircuitImages";
import { ThemedText } from "@/components/ThemedText";
import { t, translateName } from "@/i18n/utils";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function CircuitDetail() {
  const theme = useColorScheme();
  const { circuitId, initialData, year, round } = useLocalSearchParams<{
    circuitId: string,
    initialData: string,
    year: string,
    round: string
  }>()

  const circuitData = initialData ? JSON.parse(initialData) as Circuit : {} as Circuit;
  const [locationData, setLocationData] = useState<Circuit["Location"] | null>(null);
  const [driverData, setDriverData] = useState<Driver | null>(null)
  const [teamData, setTeamData] = useState<Team | null>(null)

  const fetchDriverAndTeam = () => {
    fetch(`https://f1api.dev/api/drivers/${circuitData?.fastestLapDriverId}`)
      .then(response => response.json())
      .then(data => {
        setDriverData(data.driver[0]);
      })
    fetch(`https://f1api.dev/api/teams/${circuitData?.fastestLapTeamId}`)
      .then(response => response.json())
      .then(data => {
        setTeamData(data.team[0]);
      })
  }

  const fetchExtraCircuitData = () => {
    fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/circuits/`)
      .then(response => response.json())
      .then(json => {
        const data = json.MRData.CircuitTable.Circuits[0];
        setLocationData(data.Location);
      });
  }

  useEffect(() => {
    if (initialData && initialData !== 'null' && initialData !== 'undefined') {
      fetchDriverAndTeam();
      fetchExtraCircuitData();
    } else {
      return;
    }
  }, [initialData])

  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'itemBackground');
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const seperatorColor = useThemeColor({}, 'listSeparator');

  const openMapModal = () => {
    if (locationData && locationData.lat && locationData.long) {
      router.push({
        pathname: '/season/mapModal',
        params: { latitude: locationData.lat, longitude: locationData.long }
      })
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          headerTransparent: true,
          headerTintColor: theme === "dark" ? "white" : "black",
          title: t(circuitData?.circuitName || '', 'circuit-name'),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[layoutStyles.listContainer, { backgroundColor: backgroundColor }]}
      >
        <View style={styles.imageContainer}>
          <Image
            style={{ width: Dimensions.get('window').width - 30, height: 250 }}
            resizeMode="contain"
            source={getCircuitDetailImage(circuitId)}
          />
        </View>

        <View style={cardStyles.cardsContainer}>

          {/* 地理位置卡片 */}
          <View style={[cardStyles.card, styles.cardPadding, { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor }]}>
            <TouchableOpacity style={cardStyles.infoSection} onPress={openMapModal}>
              <View style={{ flex: 1 }}>
                <View style={styles.locationContainer}>
                  <ThemedText style={styles.locationCountry}>
                    {locationData?.country || '----'}
                  </ThemedText>
                  <ThemedText style={styles.locationText}>
                    {locationData?.locality || '----'}
                  </ThemedText>
                </View>
              </View>
              <IconSymbol name='chevron.right' size={10} color={'gray'} style={{ alignSelf: 'center' }}></IconSymbol>
            </TouchableOpacity>
          </View>

          {/* 赛道信息卡片 */}
          <View style={[cardStyles.card, styles.cardPadding, { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor }]}>
            {/* 第一场比赛 */}
            <View style={cardStyles.infoSection}>
              <ThemedText style={styles.sectionLabel}>第一场比赛</ThemedText>
              <ThemedText style={styles.sectionValue}>
                {circuitData?.firstParticipationYear || '----'}
              </ThemedText>
            </View>

            <View style={[cardStyles.separator, { backgroundColor: seperatorColor }]} />

            {/* 赛道记录 */}
            <View style={cardStyles.infoSection}>
              <ThemedText style={styles.sectionLabel}>赛道记录</ThemedText>
              <View style={styles.recordContainer}>
                <ThemedText style={styles.lapRecord}>
                  {circuitData?.lapRecord || '----'}
                </ThemedText>
                <ThemedText style={styles.recordDetails}>
                  {translateName([driverData?.name || '', driverData?.surname || '']) || '----'}
                  {' · '}
                  {t(teamData?.teamName || circuitData?.fastestLapTeamId || '', 'team') || '----'}
                  {' · '}
                  {circuitData?.fastestLapYear || '----'}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView >
    </>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 14,
    marginBottom: 20,
  },
  cardPadding: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  sectionLabel: {
    fontSize: 16,
    // fontWeight: 'bold',
    flex: 1,
  },
  sectionValue: {
    fontSize: 16,
  },
  recordContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  lapRecord: {
    fontSize: 14,
    fontFamily: 'Formula1-Display-Regular',
  },
  recordDetails: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'right',
  },
  locationContainer: {
    flexDirection: 'column',
  },
  locationCountry: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  locationText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
});