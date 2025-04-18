import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Race, Result } from "@/context/F1DataContext";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { layoutStyles } from "@/components/ui/Styles";
import { t, translateName } from "@/i18n/utils";
import renderSeparator from "@/components/ui/RenderSeparator";

export default function RaceResult() {
    const { year, round, session, initialData } = useLocalSearchParams<{
        year: string;
        round: string;
        session: 'fp1' | 'fp2' | 'fp3' | 'sprintQualy' | 'sprintRace' | 'qualy' | 'race';
        initialData?: string;
    }>();

    const [resultData, setResult] = useState<Result[] | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSessionData = async () => {
        setRefreshing(true);
        try {
            let response;
            switch (session) {
                case 'sprintRace':
                    response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/sprint/`).then(response => response.json());
                    setResult(response.MRData.RaceTable.Races[0].SprintResults);
                    break;
                case 'qualy':
                    response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying/`).then(response => response.json());
                    setResult(response.MRData.RaceTable.Races[0].QualifyingResults);
                    break;
                case 'race':
                    response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/results/`).then(response => response.json());
                    setResult(response.MRData.RaceTable.Races[0].Results);
                    break;
                default:
                    return;
            }
        } catch (error) {
            console.error('Error fetching session data:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        fetchSessionData();
    }, [year, round, session]);

    useEffect(() => {
        if (initialData && initialData !== 'null' && initialData !== 'undefined') {
            setResult(JSON.parse(initialData));
            return;
        } else {
            fetchSessionData();
        }
    }, [year, round, session])

    return (
        <ThemedView>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: (() => {
                        switch (session) {
                            case 'qualy':
                                return t('Qualifying', 'session');
                            case 'sprintQualy':
                                return t('Sprint Qualifying', 'session');
                            case 'sprintRace':
                                return t('Sprint Race', 'session');
                            case 'fp1':
                                return t('FP1', 'session');
                            case 'fp2':
                                return t('FP2', 'session');
                            case 'fp3':
                                return t('FP3', 'session');
                            default:
                                return t('Race', 'session');
                        }
                    })(),
                    headerBackVisible: true,
                    headerBackTitle: 'Back',
                }}
            />
            <FlatList
                data={resultData}
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
                            {(session === 'race' || session === 'sprintRace') && (<ThemedText style={{ fontFamily: 'Formula1-Display-Bold', width: 40, textAlign: 'center' }}>
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