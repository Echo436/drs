import React, { useMemo, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import tinycolor from 'tinycolor2'

import { ThemedText } from '@/components/ThemedText'
import { layoutStyles } from '@/components/ui/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { getTeamsColor } from '@/constants/Colors'
import renderSeparator from '@/components/ui/RenderSeparator'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Host, Button, Text } from '@expo/ui/swift-ui'
import { Constructor, Race } from '@/context/F1DataContext'
import { t } from '@/i18n/utils'

export default function ConstructorDetail() {
  const { year, initialData, driverList } = useLocalSearchParams<{
    year: string
    initialData: string
    driverList?: string
  }>()

  const teamData = JSON.parse(initialData)
  // const driverListData = JSON.parse(driverList)

  const constructor = teamData.Constructor as Constructor
  const teamId = constructor.constructorId

  const [teamSeasonList, setTeamSeasonList] = useState<Race[]>([])
  const fetchTeamSeasonData = async () => {
    const [raceResponse, sprintResponse] = await Promise.all([
      fetch(
        `https://api.jolpi.ca/ergast/f1/${year}/constructors/${teamId}/results?limit=100`,
      ),
      fetch(
        `https://api.jolpi.ca/ergast/f1/${year}/constructors/${teamId}/sprint?limit=100`,
      ),
    ])
    const raceData = await raceResponse.json()
    const sprintData = await sprintResponse.json()

    const raceList: Race[] = raceData.MRData.RaceTable.Races
    const sprintList: Race[] = sprintData.MRData.RaceTable.Races

    // 合并短程赛数据到对应的比赛数据中
    const mergedList = raceList.map((race) => {
      const sprint = sprintList.find((s) => s.round === race.round)
      if (sprint) {
        return { ...race, SprintResults: sprint.SprintResults }
      }
      return race
    })

    setTeamSeasonList(mergedList)
    if (mergedList) {
      Animated.timing(seasonCardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
    return mergedList
  }

  const navigateToGrandPrix = (initialData: Race) => {
    router.navigate({
      pathname: '/season/race',
      params: { initialData: JSON.stringify(initialData) },
    })
  }

  useEffect(() => {
    setTeamSeasonList([])
    fetchTeamSeasonData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, initialData])

  // Colors
  const backgroundColor = useThemeColor({}, 'background')
  const cardBorderColor = useThemeColor({}, 'cardBorder')

  const teamColor = useMemo(() => {
    const teamColor = getTeamsColor(teamId as string)
    if (teamId && teamColor) return teamColor
    // fallback tint-ish color derived from text color
    return tinycolor(backgroundColor).toRgbString()
  }, [teamId, backgroundColor])

  const displayTeamColor = useMemo(
    () => tinycolor(teamColor).setAlpha(0.7).toRgbString(),
    [teamColor],
  )

  // Animations
  const [seasonCardOpacity] = useState(new Animated.Value(0))

  const raceItem = ({ item }: { item: Race }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigateToGrandPrix(item)}
    >
      <View style={{ flex: 1, paddingRight: 5 }}>
        <View style={{ marginBottom: 4 }}>
          <ThemedText style={styles.roundText}>
            R{String(item.round).padStart(2, '0')}
          </ThemedText>
          <ThemedText style={{ fontSize: 16, lineHeight: 20 }}>
            {t(item.raceName, 'grand-prix-name')}
          </ThemedText>
        </View>
        {(item.Results || []).map((result) => (
          <View style={{ flexDirection: 'row' }} key={result.position}>
            <ThemedText style={[styles.posSmall, { flex: 6 }]}>
              {result.Driver.code}
            </ThemedText>
            <ThemedText style={[styles.posSmall, { flex: 1 }]}>
              P{result.position}
              {result.position === '1'
                ? '🥇'
                : result.position === '2'
                  ? '🥈'
                  : result.position === '3'
                    ? '🥉'
                    : ''}
            </ThemedText>
            <ThemedText
              style={[styles.posSmall, { flex: 1, textAlign: 'center' }]}
            >
              {result.points}
            </ThemedText>
          </View>
        ))}
        {/* 冲刺赛 */}
        {item.SprintResults && (
          <View style={{ marginTop: 8 }}>
            <ThemedText style={{ flex: 6, fontSize: 14, lineHeight: 20 }}>
              {t('Sprint', 'session')}
            </ThemedText>
            {(item.SprintResults || []).map((result) => (
              <View style={{ flexDirection: 'row' }} key={result.position}>
                <ThemedText style={[styles.posSmall, { flex: 6 }]}>
                  {result.Driver.code}
                </ThemedText>
                <ThemedText style={[styles.posSmall, { flex: 1 }]}>
                  P{result.position}
                  {result.position === '1'
                    ? '🥇'
                    : result.position === '2'
                      ? '🥈'
                      : result.position === '3'
                        ? '🥉'
                        : ''}
                </ThemedText>
                <ThemedText
                  style={[styles.posSmall, { flex: 1, textAlign: 'center' }]}
                >
                  {result.points}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
      <IconSymbol
        name="chevron.right"
        size={10}
        color={'gray'}
        style={{ marginRight: -8 }}
      />
    </TouchableOpacity>
  )

  const yearText = year ?? new Date().getFullYear().toString()
  const teamName = constructor.name ?? 'Constructor'

  return (
    <LinearGradient
      colors={[displayTeamColor, backgroundColor]}
      locations={[0, 1]}
      style={[layoutStyles.centerContainer, styles.container]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          title: teamName,
          headerLargeTitle: true,
          headerLargeTitleStyle: { color: '#00000000' },
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={layoutStyles.listContainer}
      >
        {/* Profile section */}
        <View style={styles.profileContainer}>
          <View style={styles.leftColumn}>
            <View style={{ marginBottom: 2 }}>
              <ThemedText type="title" style={styles.firstText}>
                {teamName}
              </ThemedText>
            </View>

            <View style={styles.positionContainer}>
              <ThemedText style={styles.positionText}>
                {teamData.position}
              </ThemedText>
              <ThemedText style={styles.POSText}>{t('POS', 'tabs')}</ThemedText>
            </View>
            <View style={styles.positionContainer}>
              <ThemedText style={styles.positionText}>
                {teamData.points}
              </ThemedText>
              <ThemedText style={styles.POSText}>{t('PTS', 'tabs')}</ThemedText>
            </View>
            <View style={styles.positionContainer}>
              <ThemedText style={styles.positionText}>
                {teamData.wins}
              </ThemedText>
              <ThemedText style={styles.POSText}>
                {t('Wins', 'tabs')}
              </ThemedText>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-end',
                paddingTop: 14,
                paddingRight: 8,
              }}
            >
              <ThemedText
                style={{
                  textAlign: 'right',
                  fontSize: 16,
                  lineHeight: 16,
                  fontFamily: 'Formula1-Display-Bold',
                }}
              >
                {yearText}
              </ThemedText>
            </View>
            {/* <Host matchContents style={{ width: 200, marginTop: 6 }}>
              <Button
                variant="glassProminent"
                color={teamColor}
                onPress={() => {}}
              >
                <Text
                  color={tinycolor(teamColor).isLight() ? 'black' : 'white'}
                  weight="medium"
                >
                  {teamName}
                </Text>
              </Button>
            </Host> */}
          </View>
        </View>

        {/* Cards section */}
        <View style={styles.cardsContainer}>
          <Animated.View style={{ opacity: seasonCardOpacity }}>
            <BlurView
              intensity={20}
              style={[styles.card, { borderColor: cardBorderColor }]}
            >
              <FlatList
                scrollEnabled={false}
                data={teamSeasonList}
                renderItem={raceItem}
                ItemSeparatorComponent={renderSeparator}
                contentContainerStyle={{ paddingVertical: 3 }}
                ListEmptyComponent={<View style={{ height: 500 }}></View>}
              />
            </BlurView>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    marginTop: -55,
  },
  leftColumn: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  firstText: {
    fontFamily: 'Formula1-Display-Bold',
  },
  subText: {
    fontFamily: 'Formula1-Display-Regular',
    fontWeight: 'normal',
  },
  positionContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  positionText: {
    paddingRight: 5,
    fontFamily: 'Formula1-Display-Bold',
    fontSize: 28,
    lineHeight: 30,
  },
  POSText: {
    fontFamily: 'Formula1-Display-Regular',
    fontSize: 12,
    lineHeight: 21,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 6,
  },
  badgeContainer: {
    position: 'absolute',
    flex: 1,
    top: -92,
    left: 50,
    width: 310,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  badgeText: {
    fontFamily: 'Formula1-Display-Bold',
    fontSize: 150,
    lineHeight: 150,
  },
  card: {
    marginTop: 15,
    backgroundColor: 'rgba(124, 124, 124, 0.24)',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundText: {
    fontFamily: 'Formula1-Display-Regular',
    fontSize: 12,
  },
  posSmall: {
    flex: 1,
    fontFamily: 'Formula1-Display-Regular',
    fontSize: 12,
  },
})
