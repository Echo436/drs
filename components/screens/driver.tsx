import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native'
import React, { useState, useEffect, useMemo } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { DriverStanding, Race } from '@/context/F1DataContext'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import { layoutStyles } from '@/components/ui/Styles'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { getTeamsColor } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import tinycolor from 'tinycolor2'
import renderSeparator from '@/components/ui/RenderSeparator'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { t } from '@/i18n/utils'
import { Button, Host, Text } from '@expo/ui/swift-ui'
import { useConstructorStandingsQuery } from '@/hooks/useF1Queries'

export default function DriverDetail() {
  const [driverSeasonList, setDriverSeasonList] = useState<Race[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const [seasonCardOpacity] = useState(new Animated.Value(0))

  const { driverId, year, initialData } = useLocalSearchParams<{
    driverId: string
    year: string
    initialData: string
  }>()

  const fetchDriverSeasonData = async () => {
    const [raceResponse, sprintResponse] = await Promise.all([
      fetch(
        `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/results`,
      ),
      fetch(
        `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/sprint`,
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

    setDriverSeasonList(mergedList)
    if (mergedList) {
      Animated.timing(seasonCardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
    return mergedList
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    try {
      await fetchDriverSeasonData()
    } finally {
      setRefreshing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigateToGrandPrix = (initialData: Race) => {
    router.navigate({
      pathname: '/season/race',
      params: { initialData: JSON.stringify(initialData) },
    })
  }

  const { data: constructorList } = useConstructorStandingsQuery(year)
  const navigateToTeam = (constructorId: string) => {
    const constructor = constructorList.find(
      (c: { Constructor: { constructorId: string } }) => c.Constructor.constructorId === constructorId,
    )
    router.navigate({
      pathname: '/constructors/team',
      params: {
        year: year,
        initialData: JSON.stringify(constructor),
      },
    })
  }

  useEffect(() => {
    fetchDriverSeasonData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const driverInitData = initialData
    ? (JSON.parse(initialData) as DriverStanding)
    : null

  const backgroundColor = useThemeColor({}, 'background')
  const teamId = driverInitData?.Constructors[
    driverInitData?.Constructors.length - 1
  ].constructorId as string
  const teamColor = useMemo(() => {
    const teamColor = getTeamsColor(teamId as string)
    if (teamId && teamColor) return teamColor
    // fallback tint-ish color derived from text color
    return tinycolor(backgroundColor).toRgbString()
  }, [teamId, backgroundColor])
  const textColor = useThemeColor({}, 'text')
  const numberColor = tinycolor(textColor).setAlpha(0.15).toRgbString()
  const displayTeamColor = useMemo(
    () => tinycolor(teamColor).setAlpha(0.7).toRgbString(),
    [teamColor],
  )
  const cardBorderColor = useThemeColor({}, 'cardBorder')

  const raceItem = ({ item }: { item: Race }) => {
    return (
      <Link
        href={{
          pathname: '/season/race',
          params: {
            initialData: JSON.stringify(item),
          },
        }}
        // asChild
      >
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => navigateToGrandPrix(item)}
        >
          <View style={{ flex: 1, paddingRight: 5 }}>
            <ThemedText
              style={{ fontFamily: 'Formula1-Display-Bold', fontSize: 12 }}
            >
              R{String(item?.round).padStart(2, '0')}
            </ThemedText>
            <View style={{ flexDirection: 'row' }}>
              <ThemedText style={{ flex: 6, fontSize: 16, lineHeight: 20 }}>
                {t(item?.raceName, 'grand-prix-name')}
              </ThemedText>
              <ThemedText
                style={{
                  flex: 1,
                  fontFamily: 'Formula1-Display-Regular',
                  fontSize: 12,
                }}
              >
                P{item.Results[0].position}
                {item?.Results[0].position === '1'
                  ? '🥇'
                  : item?.Results[0].position === '2'
                    ? '🥈'
                    : item?.Results[0].position === '3'
                      ? '🥉'
                      : ''}
              </ThemedText>
              <ThemedText
                style={{
                  flex: 1,
                  fontFamily: 'Formula1-Display-Regular',
                  fontSize: 12,
                  textAlign: 'center',
                }}
              >
                {item.Results[0].points}
              </ThemedText>
            </View>
            {/* 冲刺赛行 */}
            {item.SprintResults && (
              <View style={{ flexDirection: 'row' }}>
                <ThemedText style={{ flex: 6, fontSize: 14, lineHeight: 20 }}>
                  {t('Sprint', 'session')}
                </ThemedText>
                <ThemedText
                  style={{
                    flex: 1,
                    fontFamily: 'Formula1-Display-Regular',
                    fontSize: 12,
                  }}
                >
                  P{item.SprintResults[0].position}
                  {item?.SprintResults[0].position === '1'
                    ? '🥇'
                    : item?.SprintResults[0].position === '2'
                      ? '🥈'
                      : item?.SprintResults[0].position === '3'
                        ? '🥉'
                        : ''}
                </ThemedText>
                <ThemedText
                  style={{
                    flex: 1,
                    fontFamily: 'Formula1-Display-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  {item.SprintResults[0].points}
                </ThemedText>
              </View>
            )}
          </View>
          <IconSymbol
            name="chevron.right"
            size={10}
            color={'gray'}
            style={{ marginRight: -8 }}
          ></IconSymbol>
        </TouchableOpacity>
      </Link>
    )
  }

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
          title: driverInitData?.Driver.code,
          headerLargeTitle: true,
          // 隐藏的largeTitle
          headerLargeTitleStyle: {
            color: '#00000000',
          },
          // headerTitleStyle: { color: '#00000000' },
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[layoutStyles.listContainer]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileContainer}>
          <View style={styles.leftColumn}>
            <View style={{ marginBottom: 10 }}>
              <ThemedText type="title" style={styles.firstNameText}>
                {driverInitData?.Driver.givenName}
              </ThemedText>
              <ThemedText type="subtitle" style={styles.lastNameText}>
                {driverInitData?.Driver.familyName}
              </ThemedText>
            </View>
            <View style={styles.positionContainer}>
              <ThemedText style={styles.positionText}>
                {driverInitData?.positionText || '-'}
              </ThemedText>
              <ThemedText style={styles.POSText}>{t('POS', 'tabs')}</ThemedText>
            </View>
            <View style={styles.positionContainer}>
              <ThemedText style={styles.positionText}>
                {driverInitData?.points || '0'}
              </ThemedText>
              <ThemedText style={styles.POSText}>{t('PTS', 'tabs')}</ThemedText>
            </View>
            <View style={styles.positionContainer}>
              <ThemedText style={styles.positionText}>
                {driverInitData?.wins || '0'}
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
                {year}
              </ThemedText>
            </View>
            <Host matchContents style={{ width: 200, marginTop: 6 }}>
              <Button
                variant="glassProminent"
                color={teamColor}
                onPress={() =>
                  navigateToTeam(
                    driverInitData?.Constructors[
                      driverInitData?.Constructors.length - 1
                    ].constructorId as string,
                  )
                }
              >
                <Text
                  color={tinycolor(teamColor).isLight() ? 'black' : 'white'}
                  weight="medium"
                >
                  {t(
                    driverInitData?.Constructors[
                      driverInitData?.Constructors.length - 1
                    ].name || '',
                    'team',
                  )}
                </Text>
              </Button>
            </Host>
          </View>
        </View>
        <View style={styles.cardsContainer}>
          <View style={styles.numberContainer}>
            <ThemedText style={[styles.numberText, { color: numberColor }]}>
              {driverInitData?.Driver.permanentNumber}
            </ThemedText>
          </View>
          <Animated.View style={{ opacity: seasonCardOpacity }}>
            <BlurView
              intensity={20}
              style={[styles.card, { borderColor: cardBorderColor }]}
            >
              <FlatList
                scrollEnabled={false}
                data={driverSeasonList}
                renderItem={raceItem}
                ItemSeparatorComponent={renderSeparator}
                contentContainerStyle={{ paddingVertical: 3 }}
                ListEmptyComponent={<View style={{ height: 500 }}></View>}
              />
            </BlurView>
          </Animated.View>
        </View>
        <View style={{ padding: 20 }}>
          <ThemedText style={{ textAlign: 'center' }}>
            {driverInitData?.Driver.nationality}
          </ThemedText>
          <ThemedText style={{ textAlign: 'center' }}>
            🎂{driverInitData?.Driver.dateOfBirth}
          </ThemedText>
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
  firstNameText: {
    fontFamily: 'Formula1-Display-Bold',
  },
  lastNameText: {
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
  numberContainer: {
    position: 'absolute',
    flex: 1,
    top: -92,
    left: 50,
    width: 310,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  numberText: {
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
})
