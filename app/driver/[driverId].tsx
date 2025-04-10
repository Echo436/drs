import { FlatList, StyleSheet, View, RefreshControl, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Driver, DriverStanding } from "@/context/F1DataContext";
import { router, Stack, useLocalSearchParams } from "expo-router";
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
import { RaceResult } from "../result/[round]";
import { t } from '@/i18n/utils';

export default function DriverDetail() {
    const { top } = useSafeAreaInsets();
    const [driverSeasonList, setDriverSeasonList] = useState<RaceResult[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const { driverId, year, initialData } = useLocalSearchParams<{
        driverId: string;
        year: string;
        initialData: string;
    }>();

    const wait = (timeout: number | undefined) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const fetchDriverSeasonData = async () => {
        try {
            const response = await fetch(`http://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/results`);
            const data = await response.json();
            setDriverSeasonList(data.MRData.RaceTable.Races);
            return data;
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

    const raceItem = ({ item }: { item: RaceResult }) => {
        return (
            <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
                <ThemedText style={{fontFamily: 'Formula1-Display-Regular', fontSize: 12}}>
                    R{String(item?.round).padStart(2, '0')}
                </ThemedText>
                <View style={{ flexDirection: 'row' }}>
                    <ThemedText style={{flex: 6}}>
                        {t(item?.raceName, 'grand-prix-name')}
                    </ThemedText>
                    <ThemedText style={{flex: 1, fontFamily: 'Formula1-Display-Regular', fontSize: 12}}>
                        P{item.Results[0].position}
                    </ThemedText>
                    <ThemedText style={{flex: 1, fontFamily: 'Formula1-Display-Regular', fontSize: 12, textAlign: 'center'}}>
                        {item.Results[0].points}
                    </ThemedText>
                </View>
                {/* 冲刺赛信息（如果有） */}
                {/* {item?.sprintResult &&
                    <ThemedText>
                        {item?.sprintResult?.raceTime}
                    </ThemedText>} */}
            </View>
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
                                <ThemedText style={{ fontSize: 22, lineHeight: 32, fontFamily: 'Formula1-Display-Regular' }}>#</ThemedText>
                                {driverInitData?.positionText || '0'}
                            </ThemedText>
                            <ThemedText style={styles.POSText}>
                                POS
                            </ThemedText>
                        </View>
                        <View style={styles.positionContainer}>
                            <ThemedText style={styles.positionText}>
                                {driverInitData?.wins || '0'}
                            </ThemedText>
                            <ThemedText style={styles.POSText}>
                                Wins
                            </ThemedText>
                        </View>
                    </View>
                    <View style={styles.rightColumn}>
                        <View style={styles.pointContainer}>
                            <ThemedText style={styles.pointText}>
                                {driverInitData?.points || '- - '}
                            </ThemedText>
                            <ThemedText style={[styles.PTSText, { color: backgroundColor, backgroundColor: textColor }]}>
                                PTS
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
        fontSize: 32,
        lineHeight: 32,
    },
    POSText: {
        fontFamily: 'Formula1-Display-Regular',
        fontSize: 14,
        lineHeight: 21
    },

    pointContainer: {
        paddingTop: 2,
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    pointText: {
        fontFamily: 'Formula1-Display-Wide',
        fontSize: 18,
        lineHeight: 20,
    },
    PTSText: {
        fontFamily: 'Formula1-Display-Wide',
        fontSize: 12.5,
        lineHeight: 12,
        paddingHorizontal: 10,
        paddingVertical: 1,
        borderRadius: 5,
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