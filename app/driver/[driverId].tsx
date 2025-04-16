import { FlatList, StyleSheet, View, RefreshControl, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { DriverStanding, Race } from "@/context/F1DataContext";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { layoutStyles } from "@/components/ui/Styles";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { getTeamsColor } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import tinycolor from 'tinycolor2';
import renderSeparator from "@/components/ui/RenderSeparator";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from "@/components/ui/IconSymbol";
import { t } from '@/i18n/utils';

export default function DriverDetail() {
    const { top } = useSafeAreaInsets();
    const [driverSeasonList, setDriverSeasonList] = useState<Race[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const { driverId, year, initialData } = useLocalSearchParams<{
        driverId: string;
        year: string;
        initialData: string;
    }>();

    const fetchDriverSeasonData = async () => {
        try {
            const [raceResponse, sprintResponse] = await Promise.all([
                fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/results`),
                fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/sprint`)
            ]);
            const raceData = await raceResponse.json();
            const sprintData = await sprintResponse.json();

            const raceList: Race[] = raceData.MRData.RaceTable.Races;
            const sprintList: Race[] = sprintData.MRData.RaceTable.Races;

            // 合并短程赛数据到对应的比赛数据中
            const mergedList = raceList.map(race => {
                const sprint = sprintList.find(s => s.round === race.round);
                if (sprint) {
                    return { ...race, SprintResults: sprint.SprintResults };
                }
                return race;
            });

            setDriverSeasonList(mergedList);
            return mergedList;
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        if (driverId) {
            fetchDriverSeasonData();
        }
    }, [driverId]);

    useEffect(() => {
        if (driverId) {
            fetchDriverSeasonData();
        }
    }, [driverId]);

    const driverInitData = initialData ? JSON.parse(initialData) as DriverStanding : null;
    const teamColor = getTeamsColor(driverInitData?.Constructors[0].constructorId as string);
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const numberColor = tinycolor(textColor).setAlpha(0.15).toRgbString();
    const displayTeamColor = tinycolor(teamColor).setAlpha(0.7).toRgbString();
    const cardBorderColor = useThemeColor({}, 'cardBorder');

    const raceItem = ({ item }: { item: Race }) => {
        return (
            <Link
                href={{ pathname: '/race/[round]', params: { round: item.round, year: year, initialData: JSON.stringify(item) } }}
                asChild
            >
                <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 20 }}>
                    <ThemedText style={{ fontFamily: 'Formula1-Display-Regular', fontSize: 12 }}>
                        R{String(item?.round).padStart(2, '0')}
                    </ThemedText>
                    <View style={{ flexDirection: 'row', marginTop: 1}}>
                        <ThemedText style={{ flex: 6, fontSize: 16, lineHeight: 20}}>
                            {t(item?.raceName, 'grand-prix-name')}
                        </ThemedText>
                        <ThemedText style={{ flex: 1, fontFamily: 'Formula1-Display-Regular', fontSize: 12 }}>
                            P{item.Results[0].position}
                        </ThemedText>
                        <ThemedText style={{ flex: 1, fontFamily: 'Formula1-Display-Regular', fontSize: 12, textAlign: 'center' }}>
                            {item.Results[0].points}
                        </ThemedText>
                    </View>
                    {item.SprintResults && (
                        <View style={{ flexDirection: 'row' }}>
                            <ThemedText style={{ flex: 6, fontSize: 14, lineHeight: 20 }}>
                                {t('Sprint', 'session')}
                            </ThemedText>
                            <ThemedText style={{ flex: 1, fontFamily: 'Formula1-Display-Regular', fontSize: 12 }}>
                                P{item.SprintResults[0].position}
                            </ThemedText>
                            <ThemedText style={{ flex: 1, fontFamily: 'Formula1-Display-Regular', fontSize: 12, textAlign: 'center' }}>
                                {item.SprintResults[0].points}
                            </ThemedText>
                        </View>
                    )}
                </TouchableOpacity>
            </Link>
        );
    };

    return (
        <LinearGradient
            colors={[displayTeamColor, backgroundColor]}
            locations={[0, 1]}
            style={[layoutStyles.centerContainer, styles.container]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    header(props) {
                        return (
                            <LinearGradient
                                colors={[tinycolor.mix(teamColor, backgroundColor, 30).toRgbString(), tinycolor.mix(teamColor, backgroundColor, 30).setAlpha(0).toRgbString()]}
                                locations={[0.6, 1]}
                                style={{
                                    height: top,
                                    width: '100%'
                                }}
                            ></LinearGradient>
                        )
                    },
                }}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={[layoutStyles.listContainer]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={{ paddingHorizontal: 5, opacity: 0.5 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={22} color={textColor} />
                    </TouchableOpacity>
                </View>
                <View style={styles.profileContainer}>
                    <View style={styles.leftColumn}>
                        <ThemedText type="title" style={styles.firstNameText}>
                            {driverInitData?.Driver.givenName}
                        </ThemedText>
                        <ThemedText type="subtitle" style={styles.lastNameText}>
                            {driverInitData?.Driver.familyName}
                        </ThemedText>
                        <View style={styles.positionContainer}>
                            <ThemedText style={styles.positionText}>
                                {driverInitData?.positionText || '-'}
                            </ThemedText>
                            <ThemedText style={styles.POSText}>
                                {t('POS', 'tabs')}
                            </ThemedText>
                        </View>
                        <View style={styles.positionContainer}>
                            <ThemedText style={styles.positionText}>
                                {driverInitData?.points || '0'}
                            </ThemedText>
                            <ThemedText style={styles.POSText}>
                                {t('PTS', 'tabs')}
                            </ThemedText>
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
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-end', paddingTop: 12 }}>
                            <ThemedText style={{
                                textAlign: 'right',
                                fontSize: 14,
                                lineHeight: 18,
                                fontFamily: 'Formula1-Display-Bold',
                            }}>
                                {year}
                            </ThemedText>
                        </View>
                    </View>
                </View>
                <View style={styles.cardsContainer}>
                    <View style={styles.numberContainer}>
                        <ThemedText style={[styles.numberText, { color: numberColor }]}>
                            {driverInitData?.Driver.permanentNumber}
                        </ThemedText>
                    </View>
                    <BlurView
                        intensity={20}
                        style={[styles.card, { borderColor: cardBorderColor }]}>
                        <FlatList
                            scrollEnabled={false}
                            data={driverSeasonList}
                            renderItem={raceItem}
                            ItemSeparatorComponent={renderSeparator}
                            contentContainerStyle={{ paddingVertical: 3 }}
                            ListEmptyComponent={<View style={{ height: 500 }}></View>}
                        />
                    </BlurView>
                </View>
            </ScrollView>
        </LinearGradient>
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
        flexDirection: 'row',
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
        lineHeight: 21
    },

    cardsContainer: {
        flex: 1,
        // borderWidth: 1,
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
        borderRadius: 15,
        overflow: 'hidden',
    },
});