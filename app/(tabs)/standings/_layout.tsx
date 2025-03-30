import React, { useState, useCallback, useEffect } from 'react';
import { CapsuleTabSwitch } from '@/components/CapsuleTabSwitch';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';

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
            { key: 'driver', label: '车手' },
            { key: 'constructor', label: '制造商' }
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