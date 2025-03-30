import { ThemedText } from "@/components/ThemedText";
import { useF1Data } from "@/context/F1DataContext";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function CurrentGrandPrix() {
    const { grandPrixList, loading, error } = useF1Data();
    
    // 获取当前或下一个大奖赛（简单实现：取第一个）
    const currentGP = grandPrixList && grandPrixList.length > 0 ? grandPrixList[0] : null;

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

    // 如果没有大奖赛数据
    if (!currentGP) {
        return (
            <View style={styles.centerContainer}>
                <ThemedText>暂无大奖赛信息</ThemedText>
            </View>
        );
    }

    // 渲染当前大奖赛信息
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ThemedText type="title">{currentGP.raceName}</ThemedText>
                <ThemedText type="subtitle">
                    {currentGP.circuit.city || currentGP.circuit.country}
                </ThemedText>
                <ThemedText>{currentGP.schedule.race.date}</ThemedText>
            </View>
            
            <View style={styles.infoContainer}>
                <ThemedText type="defaultSemiBold">赛道信息</ThemedText>
                <ThemedText>赛道名称: {currentGP.circuit.circuitName}</ThemedText>
                <ThemedText>赛道长度: {currentGP.circuit.circuitLength}</ThemedText>
                <ThemedText>弯道数量: {currentGP.circuit.corners}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        marginBottom: 24,
    },
    infoContainer: {
        marginBottom: 16,
    },
});