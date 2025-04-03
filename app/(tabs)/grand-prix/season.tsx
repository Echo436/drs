import { ThemedText } from "@/components/ThemedText";
import { Race, useF1Data } from "@/context/F1DataContext";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import renderSeparator from "@/components/ui/RenderSeparator";
import { layoutStyles } from '@/components/ui/Styles';
import { translateGPName } from "@/i18n/utils";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DateTime, Interval } from 'luxon'
import { useLocales } from "expo-localization";
import tinycolor from "tinycolor2";

import { t } from '@/i18n/utils';
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol";
// import { useGrandPrix } from "@/context/GrandPrixContext";

interface GrandPrixListProps {
    onTabChange: (tabKey: string) => void;
}

export default function GrandPrixList({ onTabChange }: GrandPrixListProps) {
    const languageCode = useLocales()[0].languageCode || 'en';
    const timeZoneOffset = DateTime.local().offset / 60;

    const { top } = useSafeAreaInsets();
    const { grandPrixList, loading, error, refreshData } = useF1Data();

    const flags = {
        'Australia': '🇦🇺',
        'China': '🇨🇳',
        'Japan': '🇯🇵',
        'Bahrain': '🇧🇭',
        'United States': '🇺🇸',
        'Canada': '🇨🇦',
        'Mexico': '🇲🇽',
        'Austria': '🇦🇹',
        'Hungary': '🇭🇺',
        'Belgium': '🇧🇪',
        'Italy': '🇮🇹',
        'Singapore': '🇸🇬',
        'United Kingdom': '🇬🇧',
        'Great Britain': '🇬🇧',
        'Azerbaijan': '🇦🇿',
        'Saudi Arabia': '🇸🇦',
        'Monaco': '🇲🇨',
        'Spain': '🇪🇸',
        'Netherlands': '🇳🇱',
        'Brazil': '🇧🇷',
        'Qatar': '🇶🇦',
        'United Arab Emirates': '🇦🇪',
    }

    // 导航到大奖赛详情页面
    const navigateToGrandPrix = (raceId: string) => {
        // router.push(`/race/${raceId}`);

        // TODO 当选择的是当前大奖赛时，切换到current
        onTabChange('first');
    };

    const renderItem = ({ item }: { item: Race }) => {
        // MM/dd or dd/MM
        const fp1Date = DateTime.fromISO(`${item.schedule.fp1.date}T${item.schedule.fp1.time}`).setLocale(languageCode).toLocaleString({ day: "2-digit", month: "2-digit" })
        const raceDate = DateTime.fromISO(`${item.schedule.race.date}T${item.schedule.race.time}`).setLocale(languageCode).toLocaleString({ day: "2-digit", month: "2-digit" })

        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => navigateToGrandPrix(item.raceId)}
                activeOpacity={0.7}
            >
                <View style={styles.roundContainer}>
                    <ThemedText style={styles.roundText}>{`R${String(item.round).padStart(2, '0')}`}</ThemedText>
                </View>
                <View style={styles.raceDetailContainer}>
                    <ThemedText type="itemtitle">{`${translateGPName(item.raceId)} ${flags[item.circuit.country as keyof typeof flags] || ''}`}</ThemedText>
                    <View style={styles.positionAndDateContainer}>
                        <ThemedText type='itemsubtitle'>{t(item.circuit.circuitId, 'circuit-id') + '·'}</ThemedText>
                        <ThemedText type="itemsubtitle">{`${fp1Date} - ${raceDate}`}</ThemedText>
                        <ThemedText style={{ paddingTop: 3, fontSize: 8, lineHeight: 8, fontWeight: 600, color: 'rgb(128, 128, 128)' }}>{` - UTC${timeZoneOffset >= 0 ? `+${timeZoneOffset}` : timeZoneOffset}`}</ThemedText>
                    </View>
                </View>
                <View style={styles.chevronContainer}>
                    <IconSymbol name='chevron.right' size={10} color={'gray'}></IconSymbol>
                </View>
            </TouchableOpacity>
        );
    };

    // 如果正在加载，显示加载信息
    if (loading) {
        return (
            <View style={layoutStyles.centerContainer}>
                <ThemedText>加载中...</ThemedText>
            </View>
        );
    }

    // 如果有错误，显示错误信息
    if (error) {
        return (
            <View style={layoutStyles.centerContainer}>
                <ThemedText>{error}</ThemedText>
            </View>
        );
    }

    // 渲染大奖赛列表
    return (
        <FlatList
            data={grandPrixList}
            renderItem={renderItem}
            keyExtractor={(item) => item.raceId}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={layoutStyles.listContainer}
            showsVerticalScrollIndicator={false}
            contentInset={{ top: top + 45, left: 0, bottom: 100, right: 0 }}
            contentOffset={{ x: 0, y: -top - 45 }}
        />
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        paddingLeft: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',

        // borderWidth: 1,
    },
    roundContainer: {
        width: 40,
        marginRight: 10,

        // borderWidth: 1,
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

        // borderWidth: 1,
    },
    positionAndDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        // borderWidth: 1,
    },
    chevronContainer: {
        marginRight: 3,
    },
});