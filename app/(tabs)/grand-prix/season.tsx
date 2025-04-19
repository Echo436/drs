import { ThemedText } from "@/components/ThemedText";
import { Race, useF1Data } from "@/context/F1DataContext";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import renderSeparator from "@/components/ui/RenderSeparator";
import { layoutStyles } from '@/components/ui/Styles';
import { router } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DateTime } from 'luxon'
import { useLocales } from "expo-localization";
import { t } from '@/i18n/utils';
import { IconSymbol } from "@/components/ui/IconSymbol";
import Slash1 from '@/assets/icon/slash-1.svg'
import Slash2 from '@/assets/icon/slash-2.svg'
import Slash3 from '@/assets/icon/slash-3.svg'
import { getTeamsColor } from "@/constants/Colors";

interface GrandPrixListProps {
    onTabChange: (tabKey: string) => void;
}

export default function GrandPrixList({ onTabChange }: GrandPrixListProps) {
    const languageCode = useLocales()[0].languageCode || 'en';
    const timeZoneOffset = DateTime.local().offset / 60;

    const { top } = useSafeAreaInsets();
    const { grandPrixList, currentRound, seasons } = useF1Data();

    const flags = {
        'Australia': '🇦🇺',
        'China': '🇨🇳',
        'Japan': '🇯🇵',
        'Bahrain': '🇧🇭',
        'United States': '🇺🇸',
        'USA': '🇺🇸',
        'Canada': '🇨🇦',
        'Mexico': '🇲🇽',
        'Austria': '🇦🇹',
        'Hungary': '🇭🇺',
        'Belgium': '🇧🇪',
        'Italy': '🇮🇹',
        'Singapore': '🇸🇬',
        'United Kingdom': '🇬🇧',
        'Great Britain': '🇬🇧',
        'UK': '🇬🇧',
        'Azerbaijan': '🇦🇿',
        'Saudi Arabia': '🇸🇦',
        'Monaco': '🇲🇨',
        'Spain': '🇪🇸',
        'Netherlands': '🇳🇱',
        'Brazil': '🇧🇷',
        'Qatar': '🇶🇦',
        'United Arab Emirates': '🇦🇪',
        'UAE': '🇦🇪',
    }

    // 导航到大奖赛详情页面
    const navigateToGrandPrix = async (round: string, year: string, initialData: string, raceDate: DateTime<true> | DateTime<false>) => {
        if (round == currentRound && year == seasons[0].season) {
            onTabChange('first');
        } else {
            router.push({ pathname: `/race/[round]`, params: { year, round, initialData } });
        }
    };

    const renderItem = ({ item }: { item: Race }) => {
        // MM/dd or dd/MM
        let fp1DateDisplay = '--';
        if (item.FirstPractice && item.FirstPractice.date && item.FirstPractice.time) { fp1DateDisplay = DateTime.fromISO(`${item.FirstPractice.date}T${item.FirstPractice.time}`).setLocale(languageCode).toLocaleString({ day: "2-digit", month: "2-digit" }); }
        let raceDate: DateTime<true> | DateTime<false>;
        let raceDateDisplay = '--'
        if (item.date && item.time) {
            raceDate = DateTime.fromISO(`${item.date}T${item.time}`);
            raceDateDisplay = raceDate.setLocale(languageCode).toLocaleString({ day: "2-digit", month: "2-digit" });
        }
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => navigateToGrandPrix(item.round, DateTime.fromISO(item.date).year.toString(), JSON.stringify(item), raceDate)}
                activeOpacity={0.7}
            >
                <View style={styles.roundContainer}>
                    <ThemedText style={styles.roundText}>{`R${String(item.round).padStart(2, '0')}`}</ThemedText>
                </View>
                <View style={styles.raceDetailContainer}>
                    <ThemedText type="itemtitle">{`${t(item.raceName, 'grand-prix-name')} ${flags[item.Circuit.Location.country as keyof typeof flags] || ''}`}</ThemedText>
                    <View style={styles.positionAndDateContainer}>
                        <ThemedText type='itemsubtitle'>{t(item.Circuit.Location.locality, 'city') + '·'}</ThemedText>
                        <ThemedText type="itemsubtitle">{`${fp1DateDisplay} - ${raceDateDisplay}`}</ThemedText>
                        <ThemedText style={{ paddingTop: 3, fontSize: 8, lineHeight: 8, fontWeight: 600, color: 'rgb(128, 128, 128)' }}>{` - UTC${timeZoneOffset >= 0 ? `+${timeZoneOffset}` : timeZoneOffset}`}</ThemedText>
                    </View>
                    {item.Results.length === 3 && (<View style={styles.podiumContainer}>
                        {[1, 2, 3].map((position) => (
                            <View key={position} style={styles.podiumItem}>
                                {position === 1 && <Slash1 style={styles.slashIcon} fill={getTeamsColor(item.Results.find(r => r.position === position.toString())?.Constructor.constructorId || '')} />}
                                {position === 2 && <Slash2 style={styles.slashIcon} fill={getTeamsColor(item.Results.find(r => r.position === position.toString())?.Constructor.constructorId || '')} />}
                                {position === 3 && <Slash3 style={styles.slashIcon} fill={getTeamsColor(item.Results.find(r => r.position === position.toString())?.Constructor.constructorId || '')} />}
                                <ThemedText style={styles.driverCode}>
                                    {item.Results.find(r => r.position === position.toString())?.Driver.code}
                                </ThemedText>
                            </View>
                        ))}
                    </View>)}
                </View>
                <View style={styles.chevronContainer}>
                    <IconSymbol name='chevron.right' size={10} color={'gray'}></IconSymbol>
                </View>
            </TouchableOpacity>
        );
    };

    // 渲染大奖赛列表
    return (
        <FlatList
            data={grandPrixList}
            renderItem={renderItem}
            keyExtractor={(item) => item.round}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={layoutStyles.listContainer}
            showsVerticalScrollIndicator={false}
            contentInset={{ top: top + 45, left: 0, bottom: 100, right: 0 }}
            contentOffset={{ x: 0, y: -top - 45 }}
            ListEmptyComponent={() => {
                return (
                    <View style={layoutStyles.centerContainer}>
                        <ThemedText style={{}}>{t('loading', 'common')}</ThemedText>
                    </View>
                )
            }}
        />
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        paddingLeft: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    roundContainer: {
        width: 40,
        marginRight: 10,
    },
    roundText: {
        fontFamily: 'Formula1-Display-Regular',
        fontSize: 12,
        textAlign: 'center'
    },
    raceDetailContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    positionAndDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 50,
        marginTop: -3,
        marginBottom: -8
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
        fontSize: 10,
        lineHeight: 10,
        fontFamily: 'Formula1-Display-Bold',
        marginLeft: 4,
    },
    chevronContainer: {
        marginRight: 3,
    },
});