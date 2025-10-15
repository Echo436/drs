import React, { useRef, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'

import { useAppSelector } from '@/hooks/useReduxHooks'
import { useThemeColor } from '@/hooks/useThemeColor'

type Tab = {
  key: string
  label: string
}

type CapsuleTabSwitchProps = {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabKey: string) => void
  containerStyle?: object
  tabSelectorStyle?: object
}

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
  const primaryColor = useAppSelector((state) => state.theme.primaryColor)
  const baseColor = useThemeColor({}, 'tabSwitcherBackground')

  // 创建动画值用于胶囊切换组件的滑动效果
  const slideAnimation = useRef(new Animated.Value(0)).current

  // 监听标签页切换并触发滑动动画
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.key === activeTab)
    Animated.timing(slideAnimation, {
      toValue: activeIndex,
      duration: 335,
      easing: Easing.bezier(0.39, 1, 0.32, 1),
      useNativeDriver: true,
    }).start()
  }, [activeTab, tabs, slideAnimation])

  // 计算动画指示器的位置
  const translateX = slideAnimation.interpolate({
    inputRange: tabs.map((_, index) => index),
    outputRange: tabs.map((_, index) => 45 + index * 90),
  })

  return (
    <View style={[styles.tabContainer, containerStyle]}>
      <View
        style={[
          { backgroundColor: baseColor },
          styles.tabSelector,
          tabSelectorStyle,
        ]}
      >
        {/* 滑动指示器 */}
        <Animated.View
          style={[
            styles.slideIndicator,
            {
              transform: [
                { translateX },
                { translateX: '-50%' },
                { translateY: '-50%' },
              ],
              backgroundColor: primaryColor,
            },
          ]}
        />
        {/* 标签按钮 */}
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === tab.key ? styles.activeTabText : null,
              ]}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabSelector: {
    height: 35,
    width: 180,
    flexDirection: 'row',
    // backgroundColor: 'rgba(151, 151, 151, 0.2)',
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
    borderRadius: 20,
    zIndex: 1,
    left: 0,
    top: '50%',
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: 0, height: 0.6 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0.6 },
    textShadowRadius: 2.5,
  },
  activeTabText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    textShadowRadius: 2,
  },
})
