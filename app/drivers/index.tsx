import { ThemedText } from "@/components/ThemedText";
import { DriverStanding, useF1Data } from "@/context/F1DataContext";
import React from "react";
import { View, StyleSheet, TouchableOpacity, RefreshControl, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { t, translateName } from '@/i18n/utils';
import renderSeparator from "@/components/ui/RenderSeparator";
import { layoutStyles } from "@/components/ui/Styles";
import { getTeamsColor } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";

export default function ConstructorList() {
    const theme = useColorScheme();

    const { driverStandingList: driverList, selectedSeason, fetchDriverListData, driverListLoading } = useF1Data();

    const onRefresh = React.useCallback(async () => {
        fetchDriverListData(selectedSeason);
    }, [selectedSeason]);


    const renderItem = ({ item }: { item: DriverStanding }) => {
        return (
            <Link href={{ pathname: '/drivers/driver', params: { driverId: item.Driver.driverId, year: selectedSeason, initialData: JSON.stringify(item) } }} asChild>
                <TouchableOpacity style={styles.itemContainer}>
                    <View style={styles.positionContainer}>
                        <ThemedText style={styles.posisionText}>{String(item.positionText).padStart(2, '0')}</ThemedText>
                    </View>
                    <View style={styles.driverInfoContainer}>
                        <ThemedText type="itemtitle">{translateName([item?.Driver?.givenName, item?.Driver?.familyName])}</ThemedText>
                        <ThemedText type="itemsubtitle" style={{ color: getTeamsColor(item.Constructors[item.Constructors.length - 1].constructorId) }}>{t(item.Constructors[item.Constructors.length - 1].name, 'team')}</ThemedText>
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

    // 渲染大奖赛列表
    return (
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            data={driverList}
            renderItem={renderItem}
            keyExtractor={(item) => item.Driver.driverId}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={layoutStyles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={driverListLoading}
                    onRefresh={onRefresh}
                />
            }
            style={{ backgroundColor: theme === 'dark' ? 'black' : 'white' }}
        />
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        paddingLeft: 13,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',

        // borderWidth: 1,
    },
    positionContainer: {
        width: 30,
        marginRight: 15,

        // borderWidth: 1,
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
        width: 50,
    },
    pointText: {
        fontFamily: 'Formula1-Display-Bold',
        fontSize: 14,
        textAlign: 'center',
    },
    chevronContainer: {
        marginRight: 3,
    },
});