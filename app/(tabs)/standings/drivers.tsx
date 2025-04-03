import { ThemedText } from "@/components/ThemedText";
import { DriverStanding, useF1Data } from "@/context/F1DataContext";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { t, translateName } from '@/i18n/utils';
import renderSeparator from "@/components/ui/RenderSeparator";
import { layoutStyles } from "@/components/ui/Styles";
import { getTeamsColor } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConstructorList() {
    const { top } = useSafeAreaInsets();
    const { driverStandingList: driverList, loading, error, refreshData } = useF1Data();

    const renderItem = ({ item }: { item: DriverStanding }) => {
        return (
            <Link href={{ pathname: '/driver/[driverId]', params: { driverId: item.driverId, initialData: JSON.stringify(item) } }} asChild>
                <TouchableOpacity style={styles.itemContainer}>
                    <View style={styles.positionContainer}>
                        <ThemedText style={styles.posisionText}>{String(item.position).padStart(2, '0')}</ThemedText>
                    </View>
                    <View style={styles.driverInfoContainer}>
                        <ThemedText type="itemtitle">{translateName([item.driver.name, item.driver.surname])}</ThemedText>
                        <ThemedText type="itemsubtitle" style={{ color: getTeamsColor(item.teamId) }}>{t(item.team.teamId, 'team')}</ThemedText>
                    </View>
                    <View style={styles.pointsContainer}>
                        <ThemedText style={styles.pointText}>{item.points}</ThemedText>
                    </View>
                    <View style={styles.chevronContainer}>
                        <IconSymbol name='chevron.right' size={10} color={'gray'}></IconSymbol>
                    </View>
                </TouchableOpacity>
            </Link>
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
            data={driverList}
            renderItem={renderItem}
            keyExtractor={(item) => item.driverId}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={layoutStyles.listContainer}
            showsVerticalScrollIndicator={false}
            contentInset={{ top: top+45, left: 0, bottom: 100, right: 0 }}
            contentOffset={{x: 0, y: -top-45}}
        />
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        paddingLeft: 15,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    positionContainer: {
        width: 30,
        marginRight: 15,
    },
    posisionText: {
        fontFamily: 'Formula1-Display-Regular',
        fontSize: 14,
        textAlign: 'center'
    },
    driverInfoContainer: {
        flex: 1,
    },
    pointsContainer: {
        width: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pointText: {
        fontFamily: 'Formula1-Display-Bold',
        fontSize: 14,
        textAlign: 'center',

        width: 30,

        // borderWidth: 1,
    },
    chevronContainer: {
        marginLeft: 3,
    },
});