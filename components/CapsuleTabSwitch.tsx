import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type Tab = {
    key: string;
    label: string;
};

type CapsuleTabSwitchProps = {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabKey: string) => void;
    containerStyle?: object;
    tabSelectorStyle?: object;
};

/**
 * 胶囊切换组件
 * 提供一个胶囊形状的标签切换器，带有平滑的滑动指示器动画
 */
export const CapsuleTabSwitch: React.FC<CapsuleTabSwitchProps> = ({
    tabs,
    activeTab,
    onTabChange,
    containerStyle,
    tabSelectorStyle,
}) => {
    // 创建动画值用于胶囊切换组件的滑动效果
    const slideAnimation = useRef(new Animated.Value(0)).current;

    // 监听标签页切换并触发滑动动画
    useEffect(() => {
        const activeIndex = tabs.findIndex(tab => tab.key === activeTab);
        Animated.timing(slideAnimation, {
            toValue: activeIndex,
            duration: 335,
            easing: Easing.bezier(.39,1,.32,1),
            useNativeDriver: true,
        }).start();
    }, [activeTab, tabs, slideAnimation]);

    // 计算动画指示器的位置
    const translateX = slideAnimation.interpolate({
        inputRange: tabs.map((_, index) => index),
        outputRange: tabs.map((_, index) => 45 + (index * 90)),
    });

    return (
        <View style={[styles.tabContainer, containerStyle]}>
            <View style={[styles.tabSelector, tabSelectorStyle]}>
                {/* 滑动指示器 */}
                <Animated.View 
                    style={[styles.slideIndicator, {
                        transform: [{ translateX }, { translateX: '-50%' }, { translateY: '-50%' }]
                    }]}
                />
                {/* 标签按钮 */}
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tab}
                        onPress={() => onTabChange(tab.key)}
                    >
                        <ThemedText 
                            style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}
                        >
                            {tab.label}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        height: 57,
        paddingBottom: 10,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    tabSelector: {
        height: 35,
        width: 180,
        flexDirection: 'row',
        backgroundColor: 'rgba(151, 151, 151, 0.2)',
        borderRadius: 20,
        position: 'relative',
    },
    tab: {
        flex: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    slideIndicator: {
        position: 'absolute',
        width: 84,
        height: 30,
        backgroundColor: 'rgba(255, 68, 0, 0.8)',
        borderRadius: 20,
        zIndex: 1,
        left: 0,
        top: '50%',
    },
    tabText: {
        fontSize: 12,
    },
    activeTabText: {
        color: 'white',
        fontWeight: 'bold',
    },
});