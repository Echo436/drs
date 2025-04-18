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
            const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${isCurrentPage ? currentRound : round}/races`)
                .then(response => response.json());
            const raceData = response.MRData.RaceTable.Races[0];
            setRaceData(raceData);

            fetch(`https://api.jolpi.ca/ergast/f1/${year}/${isCurrentPage ? currentRound : round}/sprint/`)
                .then((response) => response.json())
                .then((data) => {
                    setSprintResult(data.MRData.RaceTable.Races[0].SprintResults);
                });
            fetch(`https://api.jolpi.ca/ergast/f1/${year}/${isCurrentPage ? currentRound : round}/qualifying/`)
                .then((response) => response.json())
                .then((data) => {
                    setQualyResult(data.MRData.RaceTable.Races[0].QualifyingResults);
                });
            fetch(`https://api.jolpi.ca/ergast/f1/${year}/${isCurrentPage ? currentRound : round}/results/`)
                .then((response) => response.json())
                .then((data) => {
                    setRaceResult(data.MRData.RaceTable.Races[0].Results);
                });
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
    const numberColor = tinycolor(textColor).setAlpha(0.15).toRgbString();
    const cardBorderColor = useThemeColor({}, 'cardBorder');

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
                {!isCurrentPage && (
                    // header back button
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
                    <ThemedText type="itemtitle" style={[styles.circuitName, { fontFamily: getFontFamily() }]}>
                        {t(raceInitData?.Circuit.circuitName || raceData?.Circuit.circuitName || '', 'circuit-name')}
                    </ThemedText>
                    {/* <Link href={'/session/sessionLive'}>test</Link> */}

                </View>

                <View style={styles.cardsContainer}>
                    <View style={styles.numberContainer}>
                        <ThemedText style={[styles.numberText, { color: numberColor }]}>

                        </ThemedText>
                    </View>
                    <View
                        style={[styles.card, { borderColor: cardBorderColor }]}>
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
                                        {showEveryDayTopSeparator && (<View style={{ height: 1, backgroundColor: 'gray' }}></View>)}
                                        <View style={styles.scheduleItem}>
                                            {/* weekday and date */}
                                            <View style={styles.dateColumn}>
                                                {showDate && (<View>
                                                    <ThemedText style={styles.weekday}>{weekDisplay}</ThemedText>
                                                    <ThemedText style={styles.date}>{dateDisplay}</ThemedText>
                                                </View>)}
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                {showInDayTopSeparator && (<View style={{ height: 1, backgroundColor: 'gray' }}></View>)}
                                                {/* 每天的日程（右侧列） */}
                                                <Link href={{
                                                    pathname: '/result/[round]', params: {
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
                                                        <View>
                                                            <ThemedText style={styles.sessionName}>{item.name}</ThemedText>
                                                            <ThemedText style={styles.sessionTime}>{timeDisplay}</ThemedText>
                                                        </View>
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
        height: 250,
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
        backgroundColor: 'rgba(128, 128, 128, 0.20)',
        borderWidth: 1,
        borderRadius: 15,
        overflow: 'hidden',
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
});