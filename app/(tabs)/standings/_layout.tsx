import React, { useState, useCallback, useEffect } from 'react';
import { CapsuleTabSwitch } from '@/components/CapsuleTabSwitch';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { t } from '@/i18n/utils';

export default function GrandPrixLayout() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'driver' | 'constructor'>('driver');

    const handleTabChange = useCallback((tabKey: string) => {
        setActiveTab(tabKey as 'driver' | 'constructor');
        switch (tabKey) {
            case 'driver':
                router.replace('/standings/driver');
                break;
            case 'constructor':
                router.replace('/standings/constructor');
                break;
        }
    }, [router]);

    // 在组件挂载时执行一次handleTabChange
    useEffect(() => {
        handleTabChange(activeTab);
    }, [handleTabChange]);

    const renderHeader = () => {
        const tabs = [
            { key: 'driver', label: t('Drivers', 'tabs') },
            { key: 'constructor', label: t('Teams', 'tabs') }
        ];

        return (
            <ThemedView style={styles.headerContainer}>
                <View style={styles.tabSwitchContainer}>
                    <CapsuleTabSwitch
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                </View>
                <View style={styles.scoreTextContainer}>
                    <ThemedText style={styles.scoreText}>{t('points', 'tabs')}</ThemedText>
                </View>
            </ThemedView>
        );
    };
    return (
        <ThemedView style={styles.container}>
            {renderHeader()}
            <Slot />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    tabSwitchContainer: {
        position: 'relative',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
    scoreTextContainer: {
        width: '10%',
        marginRight: 14.5,
        marginBottom: 5,
    },
    scoreText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#5F5F5F',
        textAlign: 'center',
    },
});