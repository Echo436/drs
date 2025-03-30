import { ThemedText } from "@/components/ThemedText";
import { GrandPrix, useF1Data } from "@/context/F1DataContext";
import React from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function GrandPrixList() {
    const { grandPrixList, loading, error, refreshData } = useF1Data();

    const renderItem = ({ item }: { item: GrandPrix }) => {
        return (
            <View style={styles.itemContainer}>
                {/* 大奖赛名称 - 使用半粗体样式 */}
                <ThemedText type="defaultSemiBold">{item.raceName}</ThemedText>
                {/* 城市信息 - 优先显示城市，其次国家，最后赛道名称 */}
                <ThemedText>{item.circuit.city || item.circuit.country || item.circuit.circuitName}</ThemedText>
                {/* 比赛日期 - 使用副标题样式和日期特定样式 */}
                <ThemedText type="subtitle">{item.schedule.race.date}</ThemedText>
            </View>
        );
    };

    // 如果正在加载，显示加载信息
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ThemedText>加载中...</ThemedText>
            </View>
        );
    }

    // 如果有错误，显示错误信息
    if (error) {
        return (
            <View style={styles.centerContainer}>
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
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
});