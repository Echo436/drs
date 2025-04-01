import React, { useState, useCallback, useRef } from 'react';
import { CapsuleTabSwitch } from '@/components/CapsuleTabSwitch';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { t } from '@/i18n/utils';
import Current from './current';
import Season from './season';

// 积分榜布局组件，包含车手和车队两个标签页，支持左右滑动切换
export default function StandingsLayout() {
    // 当前激活的标签页状态，可以是'current'(车手)或'season'(车队)
    const [activeTab, setActiveTab] = useState<'current' | 'season'>('current');
    // ScrollView的引用，用于编程式控制滚动位置
    const scrollViewRef = useRef<ScrollView>(null);
    // 获取屏幕宽度，用于计算滚动距离和页面宽度
    const screenWidth = Dimensions.get('window').width;

    // 处理标签切换的回调函数
    const handleTabChange = useCallback((tabKey: string) => {
        // 更新激活的标签页
        setActiveTab(tabKey as 'current' | 'season');
        // 计算目标页面索引并滚动到对应位置
        const pageIndex = tabKey === 'current' ? 0 : 1;
        scrollViewRef.current?.scrollTo({
            x: pageIndex * screenWidth,
            animated: true
        });
    }, [screenWidth]);

    // 处理滚动结束事件的回调函数
    const handleScroll = useCallback((event: any) => {
        // 获取当前水平滚动偏移量
        const offsetX = event.nativeEvent.contentOffset.x;
        // 根据偏移量计算当前页面索引
        const pageIndex = Math.round(offsetX / screenWidth);
        // 根据页面索引确定当前标签页
        const newTab = pageIndex === 0 ? 'current' : 'season';
        // 如果标签页发生变化，则更新状态
        if (newTab !== activeTab) {
            setActiveTab(newTab);
        }
    }, [screenWidth, activeTab]);

    // 渲染页面头部，包含标签切换器和积分文本
    const renderHeader = () => {
        const tabs = [
            // 定义标签页配置，包括标识符和显示文本
            { key: 'current', label: t('Current', 'tabs') },
            { key: 'season', label: t('Season', 'tabs') }
        ];

        return (
            // 头部容器，使用主题样式
            <ThemedView style={styles.headerContainer}>
                {/* 标签切换器容器 */}
                <View style={styles.tabSwitchContainer}>
                    <CapsuleTabSwitch
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                </View>
            </ThemedView>
        );
    };
    return (
        // 主容器，应用主题样式
        <ThemedView style={styles.container}>
            {renderHeader()}
            {/* 水平滚动视图，支持分页效果 */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {/* 车手积分榜页面 */}
                <View style={[styles.page, { width: screenWidth }]}>
                    <Current />
                </View>
                {/* 车队积分榜页面 */}
                <View style={[styles.page, { width: screenWidth }]}>
                    <Season />
                </View>
            </ScrollView>
        </ThemedView>
    )
}

// 样式定义
const styles = StyleSheet.create({
    // 滚动视图样式
    scrollView: {
        flex: 1,
    },
    // 页面容器样式
    page: {
        flex: 1,
    },
    // 主容器样式，设置上边距
    container: {
        flex: 1,
        paddingTop: 50,
    },
    // 头部容器样式，水平布局
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    // 标签切换器容器样式，居中定位
    tabSwitchContainer: {
        position: 'relative',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
});