import React, { useState, useCallback, useRef } from 'react';
import { CapsuleTabSwitch } from '@/components/CapsuleTabSwitch';
import { ThemedView } from '@/components/ThemedView';
import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

type TabPageLayoutProps = {
    // 第一个标签页的组件
    FirstPage: React.ComponentType<any>;
    // 第二个标签页的组件
    SecondPage: React.ComponentType<any>;
    // 第一个标签页的标题
    firstTabLabel: string;
    // 第二个标签页的标题
    secondTabLabel: string;
    // 第一个标签页的键值
    firstTabKey?: string;
    // 第二个标签页的键值
    secondTabKey?: string;
    // 传递给第一个页面的属性
    firstPageProps?: any;
    // 传递给第二个页面的属性
    secondPageProps?: any;
    // 初始激活的标签页
    initialTab?: 'first' | 'second';

    rightBottomText?: string;
};

/**
 * 通用标签页布局组件
 * 提供两个标签页之间的滑动切换功能，支持左右滑动和标签点击切换
 */
export const TabPageLayout: React.FC<TabPageLayoutProps> = ({
    FirstPage,
    SecondPage,
    firstTabLabel,
    secondTabLabel,
    firstTabKey = 'first',
    secondTabKey = 'second',
    firstPageProps = {},
    secondPageProps = {},
    initialTab = 'first',
    rightBottomText = '',
}) => {
    const headerBorderColor = useThemeColor({}, 'headerBorder');

    // 获取安全区域的insets，用于计算顶部安全区域高度
    const { top } = useSafeAreaInsets();
    // 当前激活的标签页状态
    const [activeTab, setActiveTab] = useState<string>(initialTab === 'first' ? firstTabKey : secondTabKey);
    // ScrollView的引用，用于编程式控制滚动位置
    const scrollViewRef = useRef<ScrollView>(null);
    // 获取屏幕宽度，用于计算滚动距离和页面宽度
    const screenWidth = Dimensions.get('window').width;
    // 是否监听滚动事件的状态，用于在标签点击切换时暂停监听
    const [isScrollListenerEnabled, setIsScrollListenerEnabled] = useState(true);

    // 处理标签切换的回调函数
    const handleTabChange = useCallback((tabKey: string) => {
        // 更新激活的标签页
        setActiveTab(tabKey);
        // 暂停滚动监听，避免在编程式滚动过程中触发重复更新
        setIsScrollListenerEnabled(false);
        // 计算目标页面索引并滚动到对应位置
        const pageIndex = tabKey === firstTabKey ? 0 : 1;
        scrollViewRef.current?.scrollTo({
            x: pageIndex * screenWidth,
            animated: true
        });

        // 设置定时器，在滚动动画完成后重新启用滚动监听
        // 通常滚动动画持续约300ms
        setTimeout(() => {
            setIsScrollListenerEnabled(true);
        }, 300);
    }, [screenWidth, firstTabKey, secondTabKey]);

    // 处理滚动事件的回调函数，实时监听滑动偏移量
    const handleScroll = useCallback((event: any) => {
        // 如果滚动监听被禁用，则直接返回不处理
        if (!isScrollListenerEnabled) return;

        // 获取当前水平滚动偏移量
        const offsetX = event.nativeEvent.contentOffset.x;
        // 计算当前位置相对于页面宽度的比例
        const ratio = offsetX / screenWidth;
        // 计算当前页面索引（向下取整，得到当前所在页面的索引）
        const currentPageIndex = Math.floor(ratio);
        // 计算滑动进度（在当前页面内的滑动比例）
        const progress = ratio - currentPageIndex;

        // 当滑动超过50%时，更新标签状态
        if (progress >= 0.5) {
            const newTab = currentPageIndex === 0 ? secondTabKey : firstTabKey;
            if (newTab !== activeTab) {
                setActiveTab(newTab);
            }
        } else {
            const newTab = currentPageIndex === 0 ? firstTabKey : secondTabKey;
            if (newTab !== activeTab) {
                setActiveTab(newTab);
            }
        }
    }, [screenWidth, activeTab, isScrollListenerEnabled, firstTabKey, secondTabKey]);

    // 渲染页面头部，包含标签切换器
    const renderHeader = () => {
        const tabs = [
            // 定义标签页配置，包括标识符和显示文本
            { key: firstTabKey, label: firstTabLabel },
            { key: secondTabKey, label: secondTabLabel }
        ];

        return (
            // 头部容器，使用绝对定位和毛玻璃效果
            <View style={[styles.headerContainer, { paddingTop: top, borderColor: headerBorderColor }]}>
                {Platform.OS === 'ios' ? (
                    <BlurView
                        intensity={100}
                        style={StyleSheet.absoluteFill}
                    />
                ) : (
                    <ThemedView style={StyleSheet.absoluteFill} />
                )}
                {/* 标签切换器容器 */}
                <View style={styles.tabSwitchContainer}>
                    <CapsuleTabSwitch
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                </View>
                {/* 积分文本容器 */}
                <View style={styles.scoreTextContainer}>
                    <ThemedText style={styles.scoreText}>{rightBottomText}</ThemedText>
                </View>
            </View>
        );
    };

    return (
        // 主容器，应用主题样式
        <ThemedView style={styles.container}>
            {/* 水平滚动视图，支持分页效果 */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
                contentContainerStyle={{ paddingTop: 0 }}
            >
                {/* 第一个标签页 */}
                <View style={[styles.page, { width: screenWidth }]}>
                    <FirstPage {...firstPageProps} onTabChange={handleTabChange} />
                </View>
                {/* 第二个标签页 */}
                <View style={[styles.page, { width: screenWidth }]}>
                    <SecondPage {...secondPageProps} onTabChange={handleTabChange} />
                </View>
            </ScrollView>
            {renderHeader()}
        </ThemedView>
    );
};

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
    // 主容器样式
    container: {
        flex: 1,
    },
    // 头部容器样式，绝对定位实现覆盖效果
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
        overflow: 'hidden', // 确保BlurView不会溢出容器
        borderWidth: 0.2,
    },
    // 标签切换器容器样式，居中定位
    tabSwitchContainer: {
        position: 'relative',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2, // 确保在BlurView上方
    },
    // 积分文本容器样式
    scoreTextContainer: {
        width: '10%',
        marginRight: 14.5,
    },
    // 积分文本样式
    scoreText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#5F5F5F',
        textAlign: 'center',
        lineHeight: 15,
    },
});