import { ThemedText } from "@/components/ThemedText";
import { GrandPrix, useF1Data } from "@/context/F1DataContext";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import renderSeparator from "@/components/ui/RenderSeparator";
import { layoutStyles } from '@/components/ui/Styles';
import { translateGPName } from "@/i18n/utils";
import { useRouter } from "expo-router";

import { t } from '@/i18n/utils';

export default function GrandPrixList() {
    const { grandPrixList, loading, error, refreshData } = useF1Data();
    const router = useRouter();

    // 导航到大奖赛详情页面
    const navigateToGrandPrix = (raceId: string) => {
        router.push(`/grand-prix/grandPrixs/${raceId}`);
    };

    const renderItem = ({ item }: { item: GrandPrix }) => {
        return (
            <TouchableOpacity 
                style={styles.itemContainer}
                onPress={() => navigateToGrandPrix(item.raceId)}
                activeOpacity={0.7}
            >
                {/* 大奖赛名称 - 使用半粗体样式 */}
                <ThemedText type="itemtitle">{translateGPName(item.raceId)}</ThemedText>
                {/* 城市信息 */}
                <ThemedText type='itemsubtitle'>{t(item.circuit.circuitId, 'circuit-id')}</ThemedText>
                <ThemedText type='itemsubtitle'>{t(item.circuit.circuitName, 'circuit-name')}</ThemedText>
                {/* 比赛日期 - 使用副标题样式和日期特定样式 */}
                <ThemedText type="subtitle">{item.schedule.race.date}</ThemedText>
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
        />
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 16,
    },
});