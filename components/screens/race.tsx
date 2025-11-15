import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
  Animated,
  useColorScheme,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { Race, Result } from '@/context/F1DataContext'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import { layoutStyles, cardStyles } from '@/components/ui/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { t } from '@/i18n/utils'
import { getLocales } from 'expo-localization'
import { DateTime } from 'luxon'
import Slash1 from '@/assets/icon/slash-1.svg'
import Slash2 from '@/assets/icon/slash-2.svg'
import Slash3 from '@/assets/icon/slash-3.svg'
import { getTeamsColor } from '@/constants/Colors'
import { getCircuitImage } from '@/constants/CircuitImages'

const getFontFamily = () => {
  const locales = getLocales()
  if (locales[0].languageCode === 'zh') {
    return ''
  } else {
    return 'Formula1-Display-Bold'
  }
}

export default function GrandPrixDetail() {
  const theme = useColorScheme()
  const [extraRaceData, setExtraRaceData] = useState<Race | null>(null)
  const [qualyResultData, setQualyResult] = useState<Result[] | null>(null)
  const [sprintResultData, setSprintResult] = useState<Result[] | null>(null)
  const [raceResultData, setRaceResult] = useState<Result[] | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // 为每种结果类型创建独立的动画值
  const [sprintOpacity] = useState(new Animated.Value(0))
  const [qualyOpacity] = useState(new Animated.Value(0))
  const [raceOpacity] = useState(new Animated.Value(0))

  // 为赛道信息创建统一的动画值
  const [circuitInfoOpacity] = useState(new Animated.Value(0))

  const { initialData } = useLocalSearchParams<{
    initialData: string
  }>()
  const [raceData, setRaceData] = useState<Race>(JSON.parse(initialData))

  const fetchAllData = async () => {
    const currentRaceData = JSON.parse(initialData)

    await Promise.all([
      fetchRacesData(currentRaceData.season, currentRaceData.round),
      fetchExtraRaceData(currentRaceData.season, currentRaceData.round),
      fetchSprintResultData(currentRaceData.season, currentRaceData.round),
      fetchQualyResultData(currentRaceData.season, currentRaceData.round),
      fetchRaceResultData(currentRaceData.season, currentRaceData.round),
    ])
  }

  const fetchRacesData = (year: string, round: string) => {
    return fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/races`)
      .then((response) => response.json())
      .then((data) => {
        if (data.MRData.RaceTable.Races[0]) {
          setRaceData(data.MRData.RaceTable.Races[0])
        }
      })
  }
  const fetchExtraRaceData = (year: string, round: string) => {
    return fetch(`https://f1api.dev/api/${year}/${round}`)
      .then((response) => response.json())
      .then((data) => {
        // 数据加载完成后触发赛道信息的动画
        if (data.race[0]) {
          setExtraRaceData(data.race[0])
          // 同时淡入所有数据项
          Animated.timing(circuitInfoOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start()
        }
      })
  }
  const fetchSprintResultData = (year: string, round: string) => {
    fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/sprint/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.MRData.RaceTable.Races[0]?.SprintResults) {
          setSprintResult(data.MRData.RaceTable.Races[0].SprintResults)
          Animated.timing(sprintOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start()
        }
      })
  }
  const fetchQualyResultData = (year: string, round: string) => {
    fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.MRData.RaceTable.Races[0]?.QualifyingResults) {
          setQualyResult(data.MRData.RaceTable.Races[0].QualifyingResults)
          Animated.timing(qualyOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start()
        }
      })
  }
  const fetchRaceResultData = (year: string, round: string) => {
    fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/results/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.MRData.RaceTable.Races[0]?.Results) {
          setRaceResult(data.MRData.RaceTable.Races[0].Results)
          Animated.timing(raceOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start()
        }
      })
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    try {
      await fetchAllData()
    } finally {
      setRefreshing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setExtraRaceData(null)
    setQualyResult(null)
    setSprintResult(null)
    setRaceResult(null)
    setRaceData(JSON.parse(initialData))
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const backgroundColor = useThemeColor({}, 'background')
  const cardBackgroundColor = useThemeColor({}, 'itemBackground')
  const cardBorderColor = useThemeColor({}, 'cardBorder')
  const cardTitleColor = useThemeColor({}, 'gray')
  const seperatorColor = useThemeColor({}, 'listSeparator')

  const scheduleData = [
    {
      key: 'fp1',
      name: t('FP1', 'session'),
      session: raceData.FirstPractice,
    },
    {
      key: 'fp2',
      name: t('FP2', 'session'),
      session: raceData.SecondPractice,
    },
    {
      key: 'fp3',
      name: t('FP3', 'session'),
      session: raceData.ThirdPractice,
    },
    {
      key: 'sprintQualy',
      name: t('Sprint Qualifying', 'session'),
      session: raceData.SprintQualifying,
    },
    {
      key: 'sprintRace',
      name: t('Sprint Race', 'session'),
      session: raceData.Sprint,
    },
    {
      key: 'qualy',
      name: t('Qualifying', 'session'),
      session: raceData.Qualifying,
    },
    {
      key: 'race',
      name: t('Race', 'session'),
      session: {
        date: raceData.date,
        time: raceData.time,
      },
    },
  ].filter((item) => item.session && item.session.date !== null)

  const circuitLengthKm = (() => {
    const raw = extraRaceData?.circuit.circuitLength
    if (!raw) return '----'
    const digits = raw.replace(/[^\d]/g, '')
    if (!digits) return '----'
    const meters = parseInt(digits, 10)
    if (!Number.isFinite(meters)) return '----'
    return meters / 1000
  })()

  const cornersDisplay = extraRaceData?.circuit.corners || '---'
  const lapsDisplay = extraRaceData?.laps || '---'

  const navigateToCircuitDetail = () => {
    if (extraRaceData && raceData.Circuit.circuitId) {
      router.push({
        pathname: './circuit',
        params: {
          // this circuitId for "f1api.dev"
          circuitId: raceData.Circuit.circuitId,
          initialData: JSON.stringify(extraRaceData?.circuit),
          year: raceData.season,
          round: raceData.round,
        },
      })
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: theme === 'dark' ? 'white' : 'black',
          title: `${raceData.season}·R${raceData.round}`,
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[
          layoutStyles.listContainer,
          { backgroundColor: backgroundColor },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileContainer}>
          <ThemedText
            type="title"
            style={[styles.title, { fontFamily: getFontFamily() }]}
          >
            {t(raceData.raceName || '', 'grand-prix-name')}
          </ThemedText>
        </View>

        <View style={cardStyles.cardsContainer}>
          {/* 赛道信息卡片 */}
          <View>
            <ThemedText
              style={[cardStyles.cardTitle, { color: cardTitleColor }]}
            >
              {t(raceData.Circuit.circuitName || '', 'circuit-name')}
            </ThemedText>
            <View
              style={[
                cardStyles.card,
                {
                  borderColor: cardBorderColor,
                  backgroundColor: cardBackgroundColor,
                  paddingVertical: 12,
                  paddingLeft: 25,
                  paddingRight: 15,
                  alignItems: 'center',
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={navigateToCircuitDetail}
              >
                <View style={{ flex: 1 }}>
                  <Animated.View
                    style={{ opacity: extraRaceData ? circuitInfoOpacity : 1 }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'flex-end' }}
                    >
                      <ThemedText
                        style={{
                          fontSize: 18,
                          lineHeight: 30,
                          fontFamily: 'Formula1-Display-Regular',
                        }}
                      >
                        {circuitLengthKm}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 12, lineHeight: 28 }}>
                        {' '}
                        公里
                      </ThemedText>
                    </View>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'flex-end' }}
                    >
                      <ThemedText
                        style={{
                          fontSize: 18,
                          lineHeight: 30,
                          fontFamily: 'Formula1-Display-Regular',
                        }}
                      >
                        {cornersDisplay}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 12, lineHeight: 28 }}>
                        {' '}
                        弯道
                      </ThemedText>
                    </View>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'flex-end' }}
                    >
                      <ThemedText
                        style={{
                          fontSize: 18,
                          lineHeight: 30,
                          fontFamily: 'Formula1-Display-Regular',
                        }}
                      >
                        {lapsDisplay}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 12, lineHeight: 28 }}>
                        {' '}
                        圈
                      </ThemedText>
                    </View>
                  </Animated.View>
                </View>
                <View>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 150,
                      height: '80%',
                    }}
                    source={getCircuitImage(raceData.Circuit.circuitId)}
                  />
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={10}
                  color={'gray'}
                ></IconSymbol>
              </TouchableOpacity>
            </View>
          </View>

          {/* 比赛周末(赛程)卡片 */}
          <View>
            <ThemedText
              style={[cardStyles.cardTitle, { color: cardTitleColor }]}
            >
              {t('Race Weekend', 'session')}
            </ThemedText>
            <Animated.View
              style={[
                cardStyles.card,
                {
                  borderColor: cardBorderColor,
                  backgroundColor: cardBackgroundColor,
                },
              ]}
            >
              <FlatList
                scrollEnabled={false}
                data={scheduleData}
                renderItem={({ item, index }) => {
                  let weekDisplay = '--'
                  let dateDisplay = '--'
                  let timeDisplay = '--'

                  if (item.session && item.session.date && item.session.time) {
                    const sessionDate = DateTime.fromISO(
                      `${item.session.date}T${item.session.time}`,
                    )
                    const languageCode = getLocales()[0].languageCode || 'en'
                    weekDisplay = sessionDate
                      .setLocale(languageCode)
                      .toLocaleString({ weekday: 'short' })
                    dateDisplay = sessionDate
                      .setLocale(languageCode)
                      .toLocaleString({ day: '2-digit', month: '2-digit' })
                    timeDisplay = sessionDate
                      .setLocale(languageCode)
                      .toLocaleString({ hour: '2-digit', minute: '2-digit' })
                  }

                  const showDate =
                    index === 0 ||
                    scheduleData[index - 1].session.date !== item.session?.date
                  const showInDayTopSeparator = !showDate
                  const showEveryDayTopSeparator = showDate && index !== 0

                  return (
                    <View>
                      {showEveryDayTopSeparator && (
                        <View
                          style={{ height: 1, backgroundColor: seperatorColor }}
                        ></View>
                      )}
                      <View style={styles.scheduleItem}>
                        {/* weekday and date */}
                        <View style={styles.dateColumn}>
                          {showDate && (
                            <View>
                              <ThemedText style={styles.weekday}>
                                {weekDisplay}
                              </ThemedText>
                              <ThemedText style={styles.date}>
                                {dateDisplay}
                              </ThemedText>
                            </View>
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          {showInDayTopSeparator && (
                            <View
                              style={{
                                height: 1,
                                backgroundColor: seperatorColor,
                              }}
                            ></View>
                          )}
                          {/* 每天的日程（右侧列） */}
                          <Link
                            href={{
                              pathname: './result',
                              params: {
                                year: raceData.season,
                                round: raceData.round,
                                session: item.key,
                                initialData: (() => {
                                  switch (item.key) {
                                    case 'sprintRace':
                                      return JSON.stringify(sprintResultData)
                                    case 'qualy':
                                      return JSON.stringify(qualyResultData)
                                    case 'race':
                                      return JSON.stringify(raceResultData)
                                    default:
                                      return null
                                  }
                                })(),
                              },
                            }}
                            asChild
                          >
                            <TouchableOpacity
                              style={styles.sessionColumn}
                              disabled={
                                !(
                                  (item.key === 'sprintRace' &&
                                    sprintResultData !== null) ||
                                  (item.key === 'qualy' &&
                                    qualyResultData !== null) ||
                                  (item.key === 'race' &&
                                    raceResultData !== null)
                                )
                              }
                            >
                              <View style={{ flex: 1 }}>
                                <ThemedText style={styles.sessionName}>
                                  {item.name}
                                </ThemedText>
                                <ThemedText style={styles.sessionTime}>
                                  {timeDisplay}
                                </ThemedText>
                              </View>
                              {(() => {
                                const itemResultData = (() => {
                                  switch (item.key) {
                                    case 'sprintRace':
                                      return sprintResultData
                                    case 'qualy':
                                      return qualyResultData
                                    case 'race':
                                      return raceResultData
                                    default:
                                      return null
                                  }
                                })()

                                if (itemResultData) {
                                  // 根据不同的结果类型选择对应的动画值
                                  const animatedOpacity = (() => {
                                    switch (item.key) {
                                      case 'sprintRace':
                                        return sprintOpacity
                                      case 'qualy':
                                        return qualyOpacity
                                      case 'race':
                                        return raceOpacity
                                      default:
                                        return new Animated.Value(1) // 默认情况
                                    }
                                  })()

                                  return (
                                    <Animated.View
                                      style={[
                                        styles.podiumContainer,
                                        { opacity: animatedOpacity },
                                      ]}
                                    >
                                      {[1, 2, 3].map((position) => (
                                        <View
                                          key={position}
                                          style={styles.podiumItem}
                                        >
                                          {position === 1 && (
                                            <Slash1
                                              style={styles.slashIcon}
                                              fill={getTeamsColor(
                                                itemResultData.find(
                                                  (r) =>
                                                    r.position ===
                                                    position.toString(),
                                                )?.Constructor.constructorId ||
                                                  '',
                                              )}
                                              width={28}
                                            />
                                          )}
                                          {position === 2 && (
                                            <Slash2
                                              style={styles.slashIcon}
                                              fill={getTeamsColor(
                                                itemResultData.find(
                                                  (r) =>
                                                    r.position ===
                                                    position.toString(),
                                                )?.Constructor.constructorId ||
                                                  '',
                                              )}
                                              width={28}
                                            />
                                          )}
                                          {position === 3 && (
                                            <Slash3
                                              style={styles.slashIcon}
                                              fill={getTeamsColor(
                                                itemResultData.find(
                                                  (r) =>
                                                    r.position ===
                                                    position.toString(),
                                                )?.Constructor.constructorId ||
                                                  '',
                                              )}
                                              width={28}
                                            />
                                          )}
                                          <ThemedText style={styles.driverCode}>
                                            {
                                              itemResultData.find(
                                                (r) =>
                                                  r.position ===
                                                  position.toString(),
                                              )?.Driver.code
                                            }
                                          </ThemedText>
                                        </View>
                                      ))}
                                      {itemResultData && (
                                        <IconSymbol
                                          name="chevron.right"
                                          size={10}
                                          color={'gray'}
                                          style={{ alignSelf: 'center' }}
                                        ></IconSymbol>
                                      )}
                                    </Animated.View>
                                  )
                                }
                                return null
                              })()}
                            </TouchableOpacity>
                          </Link>
                        </View>
                      </View>
                    </View>
                  )
                }}
                keyExtractor={(item) => item.key}
                contentContainerStyle={styles.scheduleContainer}
              />
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    paddingLeft: 6,
    paddingTop: 12,
    paddingBottom: 30,
  },
  roundText: {
    fontFamily: 'Formula1-Display-Regular',
    paddingLeft: 2,
  },
  leftColumn: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 34,
  },
  circuitName: {
    fontSize: 20,
    lineHeight: 30,
    paddingLeft: 2,
  },

  scheduleContainer: {
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateColumn: {
    width: 70,
    paddingRight: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  weekday: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Formula1-Display-Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  sessionColumn: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingVertical: 10,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionTime: {
    fontSize: 12,
    fontFamily: 'Formula1-Display-Regular',
    opacity: 0.8,
  },
  podiumContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: -4,
  },
  podiumItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slashIcon: {
    position: 'relative',
    bottom: 1.5,
  },
  driverCode: {
    fontSize: 8,
    lineHeight: 8,
    fontFamily: 'Formula1-Display-Bold',
    marginLeft: 1,
  },
})
