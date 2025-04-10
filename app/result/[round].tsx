import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Constructor, Driver, Race } from "@/context/F1DataContext";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { layoutStyles } from "@/components/ui/Styles";
import { translateName } from "@/i18n/utils";
import renderSeparator from "@/components/ui/RenderSeparator";

export type Result = {
    number: string;
    position: string;
    points: string;
    Driver: Driver;
    Constructor: Constructor;
    Q1: string;
    Q2: string;
    Q3: string;
    grid: string;
    laps: string;
    status: string;
    Time: {
        millis: string;
        time: string;
    };
    FastestLap: {
        rank: string;
        lap: string;
        Time: {
            time: string;
        };
    }
}

export type RaceResult = Race & {
    Results: Result[];
    QualifyingResults: Result[];
}

export default function Result() {
    const { year, round, session } = useLocalSearchParams<{
        year: string;
        round: string;
        session: 'fp1' | 'fp2' | 'fp3' | 'sprintQualy' | 'sprintRace' | 'qualy' | 'race'
    }>();

    const [resultData, setResult] = useState<RaceResult | null>(null);

    useEffect(() => {
        switch (session) {
            case 'fp1':
                console.log('fp1');
                break;
            case 'fp2':
                console.log('fp2');
                break;
            case 'fp3':
                console.log('fp3');
                break;
            case 'sprintQualy':
                console.log('sprintQualifying');
                break;
            case 'sprintRace':
                console.log('sprint');
                break;
            case 'qualy':
                fetch(`http://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying/`)
                    .then((response) => response.json())
                    .then((data) => {
                        setResult(data.MRData.RaceTable.Races[0]);
                    });
                break;
            case 'race':
                fetch(`http://api.jolpi.ca/ergast/f1/${year}/${round}/results/`)
                    .then((response) => response.json())
                    .then((data) => {
                        setResult(data.MRData.RaceTable.Races[0]);
                    })
                break;
            default:
                break;
        }
    }, [year, round, session])

    return (
        <ThemedView>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: session === 'qualy' ? 'Qualifying' : 'Race',
                    headerBackVisible: true,
                    headerBackTitle: 'Back',
                }}
            />
            <FlatList
                data={session === 'qualy' ? resultData?.QualifyingResults : resultData?.Results}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: 10, paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 30, marginRight: 10 }}>
                            <ThemedText style={{ fontSize: 14, fontFamily: 'Formula1-Display-Regular' }}>{String(item.position).padStart(2, '0')}</ThemedText>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <ThemedText type="itemtitle">
                                        {translateName([item.Driver.givenName, item.Driver.familyName])}
                                    </ThemedText>
                                    <ThemedText type="itemsubtitle">{item.Constructor.name}</ThemedText>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 5 }}>
                                {session === 'qualy' ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                            {item.Q1 && <ThemedText style={{ padding: 1, marginRight: 2, fontSize: 10, lineHeight: 10, textAlignVertical: 'center', borderWidth: 0.5, borderRadius: 2 }}>Q1</ThemedText>}
                                            {item.Q1 && <ThemedText style={{ fontSize: 14 }}>{item.Q1}</ThemedText>}
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                            {item.Q2 && <ThemedText style={{ padding: 1, marginRight: 2, fontSize: 10, lineHeight: 10, textAlignVertical: 'center', borderWidth: 0.5, borderRadius: 2 }}>Q2</ThemedText>}
                                            {item.Q2 && <ThemedText style={{ fontSize: 14 }}>{item.Q2}</ThemedText>}
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                            {item.Q3 && <ThemedText style={{ padding: 1, marginRight: 2, fontSize: 10, lineHeight: 10, textAlignVertical: 'center', borderWidth: 0.5, borderRadius: 2 }}>Q3</ThemedText>}
                                            {item.Q3 && <ThemedText style={{ fontSize: 14 }}>{item.Q3}</ThemedText>}
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ flex: 1 }}>
                                        <ThemedText style={{ fontSize: 14 }}>{item.Time?.time || item.status}</ThemedText>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View>
                            {session === 'race' && (<ThemedText style={{ fontFamily: 'Formula1-Display-Bold', width: 40, textAlign: 'center' }}>
                                {item.points}
                            </ThemedText>)}
                        </View>
                    </View>
                )}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={item => item.position}
                contentContainerStyle={layoutStyles.listContainer}
            />
        </ThemedView>
    )
}