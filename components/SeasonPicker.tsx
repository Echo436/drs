import React, { useState } from 'react';
import { View, Modal, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Platform } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

type Season = {
    season: string;
};

type SeasonPickerProps = {
    data: Season[];
    value: string;
    onChange: (season: string) => void;
    placeholder?: string;
};

export const SeasonPicker: React.FC<SeasonPickerProps> = ({
    data,
    value,
    onChange,
    placeholder = '----'
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const textColor = useThemeColor({}, 'text');
    const cardBorderColor = useThemeColor({'light': 'rgb(175, 175, 175)', 'dark': 'rgb(80, 80, 80)'}, 'cardBorder');

    const handleSelect = (season: string) => {
        onChange(season);
        setModalVisible(false);
    };

    const renderItem = ({ item }: { item: Season }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item.season)}
        >
            <ThemedText style={[styles.itemText, { color: textColor }]}>
                {item.season}
            </ThemedText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(true)}
            >
                <ThemedText style={[styles.buttonText, { color: '#5F5F5F' }]}>
                    {value || placeholder}
                </ThemedText>
                <View style={{paddingLeft: 2}}>
                    <IconSymbol name='chevron.down' size={8} color={'#5F5F5F'}></IconSymbol>
                </View>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={[styles.modalView, { borderColor: cardBorderColor }]}>
                        {Platform.OS === 'ios' ? (
                            <BlurView
                                intensity={80}
                                style={StyleSheet.absoluteFill}
                            />
                        ) : (
                            <ThemedView style={StyleSheet.absoluteFill} />
                        )}
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.season}
                            style={[styles.list]}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 12,
        lineHeight: 15,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalView: {
        position: 'absolute',
        top: 100,
        left: '5%',
        width: '25%',
        maxHeight: 270,
        borderRadius: 10,
        borderWidth: 0.2,
        overflow: 'hidden',
    },
    list: {
        flex: 1,
        paddingVertical: 8,
    },
    item: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 12,
    },
});