import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { BlurView } from "expo-blur";
import { useAppSelector } from '@/hooks/useReduxHooks';
import { IconSymbol } from './ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from "@/hooks/useThemeColor";
import tinycolor from "tinycolor2";
import { HapticTab } from './HapticTab';

export default function MyTabBar({
    state,
    descriptors,
    navigation
}: {
    state: {
        routes: Array<{
            key: string;
            name: string;
            params?: any;
        }>;
        index: number;
    };
    descriptors: {
        [key: string]: {
            options: {
                tabBarLabel?: string;
                title?: string;
                tabBarAccessibilityLabel?: string;
                tabBarTestID?: string;
                tabBarIcon?: ({ color }: { color: string }) => { props: { name: string, size: number } };
            };
        };
    };
    navigation: {
        emit: (event: { type: string; target: string; canPreventDefault?: boolean; }) => any;
        navigate: (name: string, params?: any) => void;
    };
}) {
    const primaryColor = useAppSelector(state => state.theme.primaryColor);
    const headerBorderColor = useThemeColor({}, 'headerBorder');
    const backgroundColor = useThemeColor({}, 'background');
    const tabIconColor = useThemeColor({}, 'tabIconDefault');
    return (
        <LinearGradient
            colors={[tinycolor(backgroundColor).setAlpha(0).toRgbString(), backgroundColor]}
            locations={[0, 0.8]}
            style={styles.container}>
            {/* Decorative background TabBar */}
            <View
                style={[styles.tabbar, {
                    borderColor: headerBorderColor,
                    zIndex: 1,
                    shadowColor: primaryColor,
                    shadowOffset: { width: 0, height: 0.6 },
                    shadowOpacity: 0.6,
                    shadowRadius: 1.8,
                    overflow: 'visible',
                }]}
            />
            <BlurView
                intensity={100}
                style={[styles.tabbar, {
                    borderColor: headerBorderColor,
                    backgroundColor: tinycolor(primaryColor).setAlpha(0.05).toRgbString(),
                    zIndex: 2
                }]}
            >
                {state.routes.filter(route => route.name !== 'index').map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <HapticTab
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tab}
                        >
                            <View style={styles.tabContent}>
                                <IconSymbol
                                    size={options.tabBarIcon?.({ color: isFocused? primaryColor : tabIconColor }).props.size}
                                    name={options.tabBarIcon?.({ color: isFocused ? primaryColor : tabIconColor }).props.name}
                                    color={isFocused ? primaryColor : tabIconColor}
                                />
                                <ThemedText style={[styles.label, { color: isFocused ? primaryColor : tabIconColor }]}>
                                    {label}
                                </ThemedText>
                            </View>
                        </HapticTab>
                    );
                })}
            </BlurView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 105,
    },
    tabbar: {
        height: 80,
        width: '90%',
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 36,
        borderWidth: 0.8,
        overflow: 'hidden',
        paddingHorizontal: 15,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: { width: 0, height: 0.6 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
    },
})