import { FlatList, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Driver, DriverResult, DriverStanding } from "@/context/F1DataContext";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { layoutStyles } from "@/components/ui/Styles";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { getTeamsColor } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import tinycolor from 'tinycolor2';
import renderSeparator from "@/components/ui/RenderSeparator";

export default function DriverDetail() {
    const [driverSeasonList, setDriverSeasonList] = useState<DriverResult[]>([]);
    const fetchDriverSeasonData = async (driverId: string) => {
        await fetch(`https://f1api.dev/api/2024/drivers/${driverId}`)
            .then(response => response.json())
            .then(data => {
                setDriverSeasonList(data.results);
                return data;
            });
    };
    const { driverId, initialData } = useLocalSearchParams<{
        driverId: string;
        initialData: string;
    }>();

    useEffect(() => {
        if (driverId) {
            fetchDriverSeasonData(driverId);
        }
    }, [driverId]);

    const driverInitData = initialData ? JSON.parse(initialData) as DriverStanding : null;
    const teamColor = getTeamsColor(driverInitData?.teamId as string);
    const textColor = useThemeColor({}, 'text');
    const numberColor = tinycolor(textColor).setAlpha(0.15).toRgbString();
    const displayTeamColor = tinycolor(teamColor).setAlpha(0.7).toRgbString();
    const backgroundColor = useThemeColor({}, 'background');
    const cardBorderColor = useThemeColor({}, 'cardBorder');

    const raceItem = ({ item }: { item: DriverResult }) => {
        return (
            <View style={{padding: 10}}>
                <ThemedText>
                    {item.race?.name}
                </ThemedText>
                <ThemedText>
                    {item.result.pointsObtained}
                </ThemedText>
                <ThemedText>
                    {item.sprintResult?.raceTime}
                </ThemedText>
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
                    title: driverInitData?.driver.name,
                    headerShown: true,
                    headerTransparent: true,
                    headerBlurEffect: 'regular',
                }}
            />
            <ScrollView style={[layoutStyles.listContainer, styles.scrollContainer]}>
                <View style={styles.profileContainer}>
                    <View style={styles.leftColumn}>
                        <ThemedText type="title" style={styles.firstNameText}>
                            {driverInitData?.driver.name}
                        </ThemedText>
                        <ThemedText type="subtitle" style={styles.lastNameText}>
                            {driverInitData?.driver.surname}
                            {driverSeasonList?.length}
                        </ThemedText>
                        <View style={styles.positionContainer}>
                            <ThemedText style={styles.positionText}>
                                <ThemedText style={{ fontSize: 22, lineHeight: 32, fontFamily: 'Formula1-Display-Regular' }}>#</ThemedText>
                                {driverInitData?.position}
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
                                {driverInitData?.points}
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
                            {driverInitData?.driver.number}
                        </ThemedText>
                    </View>
                    <BlurView
                        intensity={20}
                        style={[styles.card, { borderColor: cardBorderColor }]}>
                        <ThemedText>

                        </ThemedText>
                    </BlurView>
                    <BlurView
                        intensity={20}
                        style={[styles.card, { borderColor: cardBorderColor }]}>
                        <FlatList
                            data={driverSeasonList}
                            renderItem={raceItem}
                            ItemSeparatorComponent={renderSeparator}
                            contentContainerStyle={{paddingVertical: 10}}
                            ListHeaderComponent={
                                <View>
                                    <ThemedText>qq123</ThemedText>
                                </View>
                            } />
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
    scrollContainer: {
        paddingTop: 100,
    },
    profileContainer: {
        height: 250,
        paddingVertical: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
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

        // borderWidth: 1,
    },
    positionText: {
        paddingRight: 5,
        fontFamily: 'Formula1-Display-Bold',
        fontSize: 32,
        lineHeight: 32,

        // borderWidth: 1,
    },
    POSText: {
        fontFamily: 'Formula1-Display-Regular',
        fontSize: 14,
        lineHeight: 21
    },

    pointContainer: {
        paddingTop: 8,
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    pointText: {
        fontFamily: 'Formula1-Display-Wide',
        fontSize: 20,
        lineHeight: 22,
    },
    PTSText: {
        fontFamily: 'Formula1-Display-Wide',
        fontSize: 12,
        lineHeight: 14,
        paddingHorizontal: 10,
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
        // height: 200,
        backgroundColor: 'rgba(110, 110, 110, 0.3)',
        borderWidth: 1,
        borderRadius: 15,
        overflow: 'hidden',
    }
});