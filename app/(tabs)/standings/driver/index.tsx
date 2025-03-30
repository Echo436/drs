import { ThemedText } from "@/components/ThemedText";
import { DriverStanding, useF1Data } from "@/context/F1DataContext";
import React from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { t, translateName } from '@/i18n/utils';

export default function ConstructorList() {
    const { driverList, loading, error, refreshData } = useF1Data();

    const renderItem = ({ item }: { item: DriverStanding }) => {
        return (
            <View style={styles.itemContainer}>
                {/* 车手名字 - 使用半粗体样式 */}
                <ThemedText type="defaultSemiBold">{translateName([item.driver.name, item.driver.surname])}</ThemedText>
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
            data={driverList}
            renderItem={renderItem}
            keyExtractor={(item) => item.driverId}
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