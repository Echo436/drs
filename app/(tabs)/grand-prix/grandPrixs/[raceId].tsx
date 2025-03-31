import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useF1Data } from '@/context/F1DataContext';
import { t, translateGPName } from '@/i18n/utils';
import { layoutStyles } from '@/components/ui/Styles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppSelector } from '@/hooks/useReduxHooks';

export default function GrandPrixDetail() {
    const { raceId } = useLocalSearchParams<{ raceId: string }>();
    const router = useRouter();
    const { grandPrixList, loading, error } = useF1Data();
    const primaryColor = useAppSelector(state => state.theme.primaryColor);

    // 查找对应的大奖赛数据
    const grandPrix = grandPrixList?.find(gp => gp.raceId === raceId);

    // 返回上一页
    const handleGoBack = () => {
        router.back();
    };

    // 如果正在加载，显示加载信息
    if (loading) {
        return (
            <ThemedView style={layoutStyles.centerContainer}>
                <ThemedText>加载中...</ThemedText>
            </ThemedView>
        );
    }

    // 如果有错误，显示错误信息
    if (error) {
        return (
            <ThemedView style={layoutStyles.centerContainer}>
                <ThemedText>{error}</ThemedText>
            </ThemedView>
        );
    }

    // 如果没有找到对应的大奖赛数据
    if (!grandPrix) {
        return (
            <ThemedView style={layoutStyles.centerContainer}>
                <ThemedText>未找到大奖赛信息</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* 使用Stack.Screen覆盖默认header */}
            <Stack.Screen
                options={{
                    headerShown: false, // 隐藏默认header
                    animation: 'slide_from_right', // 使用原生滑动动画
                }}
            />

            {/* 自定义顶部导航栏 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={primaryColor} />
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerTitle}>
                    {translateGPName(raceId)}
                </ThemedText>
                <View style={styles.placeholder} />
            </View>

            {/* 内容区域 */}
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* 赛道信息 */}
                <View style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                        {t('Circuit Information', 'grand-prix')}
                    </ThemedText>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Circuit Name', 'grand-prix')}:</ThemedText>
                        <ThemedText>{t(grandPrix.circuit.circuitName, 'circuit-name')}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Location', 'grand-prix')}:</ThemedText>
                        <ThemedText>
                            {grandPrix.circuit.city ? `${grandPrix.circuit.city}, ` : ''}
                            {t(grandPrix.circuit.country, 'country')}
                        </ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Circuit Length', 'grand-prix')}:</ThemedText>
                        <ThemedText>{grandPrix.circuit.circuitLength}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Corners', 'grand-prix')}:</ThemedText>
                        <ThemedText>{grandPrix.circuit.corners}</ThemedText>
                    </View>
                </View>

                {/* 比赛信息 */}
                <View style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                        {t('Race Information', 'grand-prix')}
                    </ThemedText>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Race Date', 'grand-prix')}:</ThemedText>
                        <ThemedText>{grandPrix.schedule.race.date}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Race Time', 'grand-prix')}:</ThemedText>
                        <ThemedText>{grandPrix.schedule.race.time}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Laps', 'grand-prix')}:</ThemedText>
                        <ThemedText>{grandPrix.laps}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Round', 'grand-prix')}:</ThemedText>
                        <ThemedText>{grandPrix.round}</ThemedText>
                    </View>
                </View>

                {/* 排位赛信息 */}
                <View style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                        {t('Qualifying', 'grand-prix')}
                    </ThemedText>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Qualifying Date', 'grand-prix')}:</ThemedText>
                        <ThemedText>{grandPrix.schedule.qualy.date}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">{t('Qualifying Time', 'grand-prix')}:</ThemedText>
                        <ThemedText>{grandPrix.schedule.qualy.time}</ThemedText>
                    </View>
                </View>

                {/* 练习赛信息 */}
                <View style={styles.section}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                        {t('Practice Sessions', 'grand-prix')}
                    </ThemedText>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">FP1:</ThemedText>
                        <ThemedText>{grandPrix.schedule.fp1.date} {grandPrix.schedule.fp1.time}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">FP2:</ThemedText>
                        <ThemedText>{grandPrix.schedule.fp2.date} {grandPrix.schedule.fp2.time}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText type="itemsubtitle">FP3:</ThemedText>
                        <ThemedText>{grandPrix.schedule.fp3.date} {grandPrix.schedule.fp3.time}</ThemedText>
                    </View>
                </View>

                {/* 冲刺赛信息（如果有） */}
                {grandPrix.schedule.sprintRace && grandPrix.schedule.sprintRace.date && (
                    <View style={styles.section}>
                        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                            {t('Sprint Race', 'grand-prix')}
                        </ThemedText>
                        <View style={styles.infoRow}>
                            <ThemedText type="itemsubtitle">{t('Sprint Date', 'grand-prix')}:</ThemedText>
                            <ThemedText>{grandPrix.schedule.sprintRace.date}</ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <ThemedText type="itemsubtitle">{t('Sprint Time', 'grand-prix')}:</ThemedText>
                            <ThemedText>{grandPrix.schedule.sprintRace.time}</ThemedText>
                        </View>
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60, // 为状态栏留出空间
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        width: 40, // 与返回按钮宽度相同，保持标题居中
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
        padding: 16,
    },
    sectionTitle: {
        marginBottom: 12,
        fontSize: 18,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
});