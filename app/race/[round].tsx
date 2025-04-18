import { FlatList, StyleSheet, View, RefreshControl, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Race, Result } from "@/context/F1DataContext";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { layoutStyles } from "@/components/ui/Styles";
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from "@/hooks/useThemeColor";
import tinycolor from 'tinycolor2';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useF1Data } from "@/context/F1DataContext";
import { ThemedView } from "@/components/ThemedView";
import { t } from "@/i18n/utils";
import { getLocales } from "expo-localization";
import { DateTime } from 'luxon';
import Slash1 from '@/assets/icon/slash-1.svg'
import Slash2 from '@/assets/icon/slash-2.svg'
import Slash3 from '@/assets/icon/slash-3.svg'
import { getTeamsColor } from "@/constants/Colors";
import { getCircuitImage } from '@/constants/CircuitImages';

const getFontFamily = () => {
    const locales = getLocales();
    if (locales[0].languageCode === 'zh') {
        return '';
    } else {
        return 'Formula1-Display-Bold';
    }
}

export default function GrandPrixDetail({ isCurrentPage = false, currentRound = '0', currentRace }: { isCurrentPage?: boolean, currentRound?: string, currentRace?: Race }) {
    const { top } = useSafeAreaInsets();
    const [raceData, setRaceData] = useState<Race | null>(null);
    const [extraRaceData, setExtraRaceData] = useState<Race | null>(null);
    const [qualyResultData, setQualyResult] = useState<Result[] | null>(null);
    const [sprintResultData, setSprintResult] = useState<Result[] | null>(null);
    const [raceResultData, setRaceResult] = useState<Result[] | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { selectedSeason, seasons } = useF1Data();

    if (selectedSeason !== seasons[0].season && isCurrentPage) {
        return (
            <ThemedView style={layoutStyles.centerContainer}>
                <ThemedText>
                    Coming soon
                </ThemedText>
            </ThemedView>
        )
    }

    const { round, year, initialData } = useLocalSearchParams<{
        round: string;
        year: string;
        initialData: string;
    }>();

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const requestYear = isCurrentPage ? seasons[0].season : year;
            const requestRound = isCurrentPage ? currentRound : round;
            await Promise.all([
                fetch(`https://api.jolpi.ca/ergast/f1/${requestYear}/${requestRound}/races`).then(response => response.json())
                    .then(data => setRaceData(data.MRData.RaceTable.Races[0])),
                fetch(`https://f1api.dev/api/${requestYear}/${requestRound}`).then(response => response.json())
                   .then(data => setExtraRaceData(data.race[0])),
                fetch(`https://api.jolpi.ca/ergast/f1/${requestYear}/${requestRound}/sprint/`).then(response => response.json())
                   .then(data => setSprintResult(data.MRData.RaceTable.Races[0].SprintResults)),
                fetch(`https://api.jolpi.ca/ergast/f1/${requestYear}/${requestRound}/qualifying/`).then(response => response.json())
                  .then(data => setQualyResult(data.MRData.RaceTable.Races[0].QualifyingResults)),
                fetch(`https://api.jolpi.ca/ergast/f1/${requestYear}/${requestRound}/results/`).then(response => response.json())
                  .then(data => setRaceResult(data.MRData.RaceTable.Races[0].Results)),
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        fetchData();
    }, []);

    useEffect(() => {
        if (isCurrentPage) {
            setRaceData(currentRace || null);
        }
        fetchData();
    }, []);

    const raceInitData = initialData ? JSON.parse(initialData) as Race : null;
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const cardBackgroundColor = useThemeColor({ dark: 'rgb(15, 15, 15)' }, 'background');
    const cardBorderColor = useThemeColor({}, 'cardBorder');
    const seperatorColor = useThemeColor({}, 'listSeparator');

    const scheduleData = [
        { key: 'fp1', name: t('FP1', 'session'), session: (raceData || raceInitData)?.FirstPractice },
        { key: 'fp2', name: t('FP2', 'session'), session: (raceData || raceInitData)?.SecondPractice },
        { key: 'fp3', name: t('FP3', 'session'), session: (raceData || raceInitData)?.ThirdPractice },
        { key: 'sprintQualy', name: t('Sprint Qualifying', 'session'), session: (raceData || raceInitData)?.SprintQualifying },
        { key: 'sprintRace', name: t('Sprint Race', 'session'), session: (raceData || raceInitData)?.Sprint },
        { key: 'qualy', name: t('Qualifying', 'session'), session: (raceData || raceInitData)?.Qualifying },
        {
            key: 'race', name: t('Race', 'session'), session: {
                date: (raceData || raceInitData)?.date,
                time: (raceData || raceInitData)?.time,
            }
        },
    ].filter(item => item.session && item.session.date !== null);

    const navigateToCircuitDetail = () => {
        router.push({ pathname: '/race/circuit', params: { circuitId: raceInitData?.Circuit.circuitId || raceData?.Circuit.circuitId, initialData: JSON.stringify(extraRaceData?.circuit) } });
    }

    return (
        <ThemedView
            style={[layoutStyles.centerContainer, styles.container]}>
            {!isCurrentPage && (<Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    header(props) {
                        return (
                            <LinearGradient
                                colors={[tinycolor(backgroundColor).toRgbString(), tinycolor(backgroundColor).setAlpha(0).toRgbString()]}
                                locations={[0.6, 1]}
                                style={{
                                    height: top,
                                    width: '100%'
                                }}
                            ></LinearGradient>
                        )
                    },
                }}
            />)}
            <ScrollView
                contentInset={{ top: isCurrentPage ? top + 45 : top, left: 0, bottom: 0, right: 0 }}
                style={[layoutStyles.listContainer]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* header back button */}
                {!isCurrentPage && (
                    <View style={{ paddingHorizontal: 5, opacity: 0.5 }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <IconSymbol name="chevron.left" size={22} color={textColor} />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.profileContainer}>
                    <ThemedText style={styles.roundText}>
                        {year || raceData?.season || raceInitData?.season}
                        <ThemedText style={{ fontFamily: ' ' }}>
                            ·
                        </ThemedText>
                        {`R${String(raceInitData?.round || raceData?.round).padStart(2, '0')}`}
                    </ThemedText>
                    <ThemedText type="title" style={[styles.title, { fontFamily: getFontFamily() }]}>
                        {t(raceInitData?.raceName || raceData?.raceName || '', 'grand-prix-name')}
                    </ThemedText>
                    {/* <Link href={'/session/sessionLive'}>test</Link> */}
                </View>

                <View style={styles.cardsContainer}>
                    <ThemedText style={styles.cardTitle}>{t(raceInitData?.Circuit.circuitName || raceData?.Circuit.circuitName || '', 'circuit-name')}</ThemedText>
                    {/* <Link> */}
                    <View style={[styles.card, { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor, paddingVertical: 15, paddingLeft: 25, paddingRight: 15, alignItems: 'center' }]}>
                        <TouchableOpacity
                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            onPress={navigateToCircuitDetail}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <ThemedText style={{ fontSize: 20, lineHeight: 30, fontFamily: 'Formula1-Display-Regular' }}>{extraRaceData?.circuit.circuitLength?.slice(0, -2)?.replace(/^(\d)(\d)/, '$1.$2') || '--'}</ThemedText>
                                    <ThemedText style={{ fontSize: 12, lineHeight: 28 }}> 公里</ThemedText>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <ThemedText style={{ fontSize: 20, lineHeight: 30, fontFamily: 'Formula1-Display-Regular' }}>{extraRaceData?.circuit.corners || '--'}</ThemedText>
                                    <ThemedText style={{ fontSize: 12, lineHeight: 28 }}> 弯道</ThemedText>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <ThemedText style={{ fontSize: 20, lineHeight: 30, fontFamily: 'Formula1-Display-Regular' }}>{extraRaceData?.laps || '--'}</ThemedText>
                                    <ThemedText style={{ fontSize: 12, lineHeight: 28 }}> 圈</ThemedText>
                                </View>
                            </View>
                            <View>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        width: 150,
                                        height: '80%',
                                    }}
                                    source={getCircuitImage(raceInitData?.Circuit.circuitId || raceData?.Circuit.circuitId)}
                                />
                            </View>
                            <IconSymbol name='chevron.right' size={10} color={'gray'}></IconSymbol>
                        </TouchableOpacity>
                    </View>
                    {/* </Link> */}
                </View>

                <View style={styles.cardsContainer}>
                    <ThemedText style={styles.cardTitle}>{t('Race Weekend', 'session')}</ThemedText>
                    <View
                        style={[styles.card, { borderColor: cardBorderColor, backgroundColor: cardBackgroundColor }]}>
                        <FlatList
                            scrollEnabled={false}
                            data={scheduleData}
                            renderItem={({ item, index }) => {
                                let weekDisplay = '--';
                                let dateDisplay = '--';
                                let timeDisplay = '--';

                                if (item.session.date && item.session.time) {
                                    const sessionDate = DateTime.fromISO(`${item.session.date}T${item.session.time}`);
                                    const languageCode = getLocales()[0].languageCode || 'en';
                                    weekDisplay = sessionDate.setLocale(languageCode).toLocaleString({ weekday: 'short' });
                                    dateDisplay = sessionDate.setLocale(languageCode).toLocaleString({ day: '2-digit', month: '2-digit' });
                                    timeDisplay = sessionDate.setLocale(languageCode).toLocaleString({ hour: '2-digit', minute: '2-digit' });
                                }

                                const showDate = index === 0 || scheduleData[index - 1].session.date !== item.session?.date;
                                const showInDayTopSeparator = !showDate;
                                const showEveryDayTopSeparator = showDate && index !== 0;

                                return (
                                    <View>
                                        {showEveryDayTopSeparator && (<View style={{ height: 1, backgroundColor: seperatorColor }}></View>)}
                                        <View style={styles.scheduleItem}>
                                            {/* weekday and date */}
                                            <View style={styles.dateColumn}>
                                                {showDate && (<View>
                                                    <ThemedText style={styles.weekday}>{weekDisplay}</ThemedText>
                                                    <ThemedText style={styles.date}>{dateDisplay}</ThemedText>
                                                </View>)}
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                {showInDayTopSeparator && (<View style={{ height: 1, backgroundColor: seperatorColor }}></View>)}
                                                {/* 每天的日程（右侧列） */}
                                                <Link href={{
                                                    pathname: '/race/result/[round]', params: {
                                                        year: year, round: isCurrentPage ? currentRound : round, session: item.key,
                                                        initialData: (() => {
                                                            switch (item.key) {
                                                                case 'sprintRace':
                                                                    return JSON.stringify(sprintResultData);
                                                                case 'qualy':
                                                                    return JSON.stringify(qualyResultData);
                                                                case 'race':
                                                                    return JSON.stringify(raceResultData);
                                                                default:
                                                                    return null;
                                                            }
                                                        })()
                                                    }
                                                }} asChild>
                                                    <TouchableOpacity style={styles.sessionColumn}>
                                                        <View style={{ flex: 1 }}>
                                                            <ThemedText style={styles.sessionName}>{item.name}</ThemedText>
                                                            <ThemedText style={styles.sessionTime}>{timeDisplay}</ThemedText>
                                                        </View>
                                                        {(() => {
                                                            const itemResultData = (() => {
                                                                switch (item.key) {
                                                                    case 'sprintRace':
                                                                        return sprintResultData;
                                                                    case 'qualy':
                                                                        return qualyResultData;
                                                                    case 'race':
                                                                        return raceResultData;
                                                                    default:
                                                                        return null;
                                                                }
                                                            })();
                                                            return itemResultData && (<View style={styles.podiumContainer}>
                                                                {[1, 2, 3].map((position) => (
                                                                    <View key={position} style={styles.podiumItem}>
                                                                        {position === 1 && <Slash1 style={styles.slashIcon} fill={getTeamsColor(itemResultData.find(r => r.position === position.toString())?.Constructor.constructorId || '')} width={28} />}
                                                                        {position === 2 && <Slash2 style={styles.slashIcon} fill={getTeamsColor(itemResultData.find(r => r.position === position.toString())?.Constructor.constructorId || '')} width={28} />}
                                                                        {position === 3 && <Slash3 style={styles.slashIcon} fill={getTeamsColor(itemResultData.find(r => r.position === position.toString())?.Constructor.constructorId || '')} width={28} />}
                                                                        <ThemedText style={styles.driverCode}>
                                                                            {itemResultData.find(r => r.position === position.toString())?.Driver.code}
                                                                        </ThemedText>
                                                                    </View>
                                                                ))}
                                                            </View>);
                                                        })()}
                                                    </TouchableOpacity>
                                                </Link>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }}
                            keyExtractor={item => item.key}
                            contentContainerStyle={styles.scheduleContainer}
                        />
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'column',
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

    cardsContainer: {
        flex: 1,
        paddingTop: 20,
    },
    card: {
        backgroundColor: 'rgb(255, 255, 255)',
        borderWidth: 0.5,
        borderRadius: 15,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cardTitle: {
        paddingLeft: 15,
        paddingBottom: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },

    scheduleContainer: {
        paddingVertical: 10,
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
        paddingTop: 10,
        paddingBottom: 9,
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
        bottom: 1.5
    },
    driverCode: {
        fontSize: 8,
        lineHeight: 8,
        fontFamily: 'Formula1-Display-Bold',
        marginLeft: 1,
    },
});