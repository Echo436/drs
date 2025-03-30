import React, { useState, useCallback, useEffect } from 'react';
import { CapsuleTabSwitch } from '@/components/CapsuleTabSwitch';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { t } from '@/i18n/utils';

export default function GrandPrixLayout() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'current' | 'season'>('current');

    const handleTabChange = useCallback((tabKey: string) => {
        setActiveTab(tabKey as 'current' | 'season');
        switch (tabKey) {
            case 'current':
                router.replace('/grand-prix/current');
                break;
            case 'season':
                router.replace('/grand-prix/season');
                break;
        }
    }, [router]);

    // 在组件挂载时执行一次handleTabChange
    useEffect(() => {
        handleTabChange(activeTab);
    }, [handleTabChange]);

    const renderHeader = () => {
        const tabs = [
            { key: 'current', label: t('Current', 'tabs') },
            { key: 'season', label: t('Season', 'tabs') }
        ];

        // 渲染胶囊切换组件
        return (
            <CapsuleTabSwitch
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
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
        flex: 1,           // 占满整个屏幕
        paddingTop: 50,    // 为状态栏留出空间
    },
});