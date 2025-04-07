import { ThemedText } from "@/components/ThemedText";
import { ConstructorStanding, Driver, useF1Data } from "@/context/F1DataContext";
import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { t } from "@/i18n/utils";
import renderSeparator from "@/components/ui/RenderSeparator";
import { layoutStyles } from "@/components/ui/Styles";
import { getTeamsColor } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConstructorList() {
    const { top } = useSafeAreaInsets();
    const { constructorList, driverStandingList: driverStandingList } = useF1Data();

    const renderItem = ({ item }: { item: ConstructorStanding }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.positionContainer}>
                    <ThemedText style={styles.posisionText}>{String(item.position).padStart(2, '0')}</ThemedText>
                </View>
                <View style={styles.teamInfoContainer}>
                    <ThemedText type="itemtitle">{t(item.Constructor.constructorId, 'team')}</ThemedText>
                    {/* <ThemedText type="itemtitle">{t(item.teamId, 'team')}</ThemedText> */}
                    <View style={styles.driversContainer}>
                        {driverStandingList
                            .filter(driver => driver.Constructors[0].constructorId === item.Constructor.constructorId)
                            // .filter(driver => driver.teamId === item.teamId)
                            .map(driver => (
                                <ThemedText key={driver.Driver.driverId} type="itemsubtitle" style={styles.driverNameText}>
                                    {driver.Driver.code}
                                    {/* {driver.driver.shortName} */}
                                </ThemedText>
                            ))}
                    </View>
                </View>
                <View style={styles.pointsContainer}>
                    <ThemedText style={styles.pointText}>{item.points}</ThemedText>
                </View>
                <View style={styles.chevronContainer}>
                    <IconSymbol name='chevron.right' size={10} color={'gray'}></IconSymbol>
                </View>
            </View>
        );
    };

    // 渲染大奖赛列表
    return (
        <FlatList
            data={constructorList}
            renderItem={renderItem}
            keyExtractor={(item) => item.Constructor.constructorId}
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
        paddingLeft: 13,
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
    driversContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    driverNameText: {
        fontFamily: 'Formula1-Display-Regular',
    },
    teamInfoContainer: {
        flex: 1,
    },
    pointsContainer: {
        width: 40,
    },
    pointText: {
        fontFamily: 'Formula1-Display-Bold',
        fontSize: 14,
        textAlign: 'center'
    },
    chevronContainer: {
        marginRight: 3,
    },
});