// API数据类型定义

// Some data about each car, at a sample rate of about 3.7 Hz.
interface CarData {
    brake: number;
    date: string;
    driver_number: number;
    drs: number;
    meeting_key: number;
    n_gear: number;
    rpm: number;
    session_key: number;
    speed: number;
    throttle: number;
}

// Fetches real-time interval data between drivers and their gap to the race leader.
// Available during races only, with updates approximately every 4 seconds.
interface Interval {
    date: string;
    driver_number: number;
    gap_to_leader: number;
    interval: number;
    meeting_key: number;
    session_key: number;
}

// Provides detailed information about individual laps.
// Below is a table that correlates segment values to their meaning.
// Value	Color
// 0	not available
// 2048	yellow sector
// 2049	green sector
// 2050	?
// 2051	purple sector
// 2052	?
// 2064	pitlane
// 2068	?
interface Lap {
    date_start: string;
    driver_number: number;
    duration_sector_1: number;
    duration_sector_2: number;
    duration_sector_3: number;
    i1_speed: number;
    i2_speed: number;
    is_pit_out_lap: number;
    lap_duration: number;
    lap_number: number;
    meeting_key: number;
    segments_sector_1: number[];
    segments_sector_2: number[];
    segments_sector_3: number[];
    session_key: number;
    st_speed: number;
}

// Provides information about cars going through the pit lane.
interface Pit {
    date: string;
    driver_number: number;
    lap_number: number;
    meeting_key: number;
    pit_duration: number;
    session_key: number;
}

// Provides driver positions throughout a session, including initial placement and subsequent changes.

import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import renderSeparator from '@/components/ui/RenderSeparator';
import { ThemedText } from '@/components/ThemedText';

interface Driver {
    driver_number: number;
    name: string;
}

interface Position {
    date: string;
    driver_number: number;
    meeting_key: number;
    position: number;
    session_key: number;
}

// 整合所有驾驶员数据的接口
interface DriverData {
    driver_number: number;
    name: string;
    position?: Position;
    carData?: CarData;
    interval?: Interval;
    lap?: Lap;
    pit?: Pit;
}

const API_BASE_URL = 'https://api.openf1.org/v1';
// 默认数据刷新间隔时间（毫秒），根据API更新频率设置为4000毫秒
const DEFAULT_REFRESH_INTERVAL = 40000000000000;

const DRIVERS: Driver[] = [
    { driver_number: 16, name: 'LEC' },
    { driver_number: 44, name: 'HAM' },
    { driver_number: 1, name: 'VER' },
    { driver_number: 4, name: 'NOR' },
    { driver_number: 63, name: 'RUS' },
    { driver_number: 81, name: 'PIA' },
    { driver_number: 12, name: 'ANT' },
    { driver_number: 23, name: 'ALB' },
    { driver_number: 31, name: 'OCO' },
    { driver_number: 18, name: 'STR' },
    { driver_number: 27, name: 'HUL' },
    { driver_number: 87, name: 'BEA' },
    { driver_number: 22, name: 'TSU' },
    { driver_number: 55, name: 'SAI' },
    { driver_number: 10, name: 'GAS' },
    { driver_number: 6, name: 'HAD' },
    { driver_number: 30, name: 'LAW' },
    { driver_number: 7, name: 'DOO' },
    { driver_number: 5, name: 'BOR' },
    { driver_number: 14, name: 'ALO' },
    // Add more drivers as needed
];

// 获取位置数据
const fetchPositionData = async (sessionKey: number = 10002): Promise<Position[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/position?session_key=${sessionKey}`);
        return await res.json();
    } catch (err) {
        console.warn('Failed to fetch position data', err);
        return [];
    }
};

// 获取车辆数据
const fetchCarData = async (sessionKey: number = 10002): Promise<CarData[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/car_data?session_key=${sessionKey}`);
        return await res.json();
    } catch (err) {
        console.warn('Failed to fetch car data', err);
        return [];
    }
};

// 获取间隔数据
const fetchIntervalData = async (sessionKey: number = 10002): Promise<Interval[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/intervals?session_key=${sessionKey}`);
        return await res.json();
    } catch (err) {
        console.warn('Failed to fetch interval data', err);
        return [];
    }
};

// 获取圈速数据
const fetchLapData = async (sessionKey: number = 10002): Promise<Lap[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/laps?session_key=${sessionKey}`);
        return await res.json();
    } catch (err) {
        console.warn('Failed to fetch lap data', err);
        return [];
    }
};

// 获取进站数据
const fetchPitData = async (sessionKey: number = 10002): Promise<Pit[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/pit?session_key=${sessionKey}`);
        return await res.json();
    } catch (err) {
        console.warn('Failed to fetch pit data', err);
        return [];
    }
};

interface RaceMonitorProps {
    refreshInterval?: number; // 可选参数，允许自定义刷新间隔
    sessionKey?: number; // 可选参数，允许自定义session_key
}

const RaceMonitor = ({ refreshInterval = DEFAULT_REFRESH_INTERVAL, sessionKey = 10002 }: RaceMonitorProps = {}) => {
    const [positions, setPositions] = useState<Record<number, Position | undefined>>({});
    const [carData, setCarData] = useState<Record<number, CarData | undefined>>({});
    const [intervals, setIntervals] = useState<Record<number, Interval | undefined>>({});
    const [laps, setLaps] = useState<Record<number, Lap | undefined>>({});
    const [pits, setPits] = useState<Record<number, Pit | undefined>>({});
    const [driverData, setDriverData] = useState<Record<number, DriverData>>({});
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            // 并行获取所有数据
            const [positionData, carDataResult, intervalData, lapData, pitData] = await Promise.all([
                fetchPositionData(sessionKey),
                fetchCarData(sessionKey),
                fetchIntervalData(sessionKey),
                fetchLapData(sessionKey),
                fetchPitData(sessionKey)
            ]);
            
            // 处理位置数据
            const latestPositions: Record<number, Position | undefined> = {};
            if (positionData.length > 0) {
                DRIVERS.forEach(driver => {
                    const latest = [...positionData].reverse().find(pos => pos.driver_number === driver.driver_number);
                    latestPositions[driver.driver_number] = latest;
                });
                setPositions(latestPositions);
            }
            
            // 处理车辆数据
            const latestCarData: Record<number, CarData | undefined> = {};
            if (carDataResult.length > 0) {
                DRIVERS.forEach(driver => {
                    const latest = [...carDataResult].reverse().find(data => data.driver_number === driver.driver_number);
                    latestCarData[driver.driver_number] = latest;
                });
                setCarData(latestCarData);
            }
            
            // 处理间隔数据
            const latestIntervals: Record<number, Interval | undefined> = {};
            if (intervalData.length > 0) {
                DRIVERS.forEach(driver => {
                    const latest = [...intervalData].reverse().find(data => data.driver_number === driver.driver_number);
                    latestIntervals[driver.driver_number] = latest;
                });
                setIntervals(latestIntervals);
            }
            
            // 处理圈速数据
            const latestLaps: Record<number, Lap | undefined> = {};
            if (lapData.length > 0) {
                DRIVERS.forEach(driver => {
                    const latest = [...lapData].reverse().find(data => data.driver_number === driver.driver_number);
                    latestLaps[driver.driver_number] = latest;
                });
                setLaps(latestLaps);
            }
            
            // 处理进站数据
            const latestPits: Record<number, Pit | undefined> = {};
            if (pitData.length > 0) {
                DRIVERS.forEach(driver => {
                    const latest = [...pitData].reverse().find(data => data.driver_number === driver.driver_number);
                    latestPits[driver.driver_number] = latest;
                });
                setPits(latestPits);
            }
            
            // 整合所有数据
            const combinedData: Record<number, DriverData> = {};
            DRIVERS.forEach(driver => {
                combinedData[driver.driver_number] = {
                    ...driver,
                    position: latestPositions[driver.driver_number],
                    carData: latestCarData[driver.driver_number],
                    interval: latestIntervals[driver.driver_number],
                    lap: latestLaps[driver.driver_number],
                    pit: latestPits[driver.driver_number]
                };
            });
            setDriverData(combinedData);
            
            setLastUpdated(new Date().toLocaleTimeString());
        };

        // 初始加载
        fetchData();

        // 设置定时刷新
        const interval = setInterval(fetchData, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval, sessionKey]);

    // 根据position对驾驶员进行排序
    const sortedDrivers = [...DRIVERS].sort((a, b) => {
        const posA = positions[a.driver_number]?.position ?? Number.MAX_SAFE_INTEGER;
        const posB = positions[b.driver_number]?.position ?? Number.MAX_SAFE_INTEGER;
        return posA - posB;
    });
    
    // 获取驾驶员的最新DRS状态
    const getDrsStatus = (driverNumber: number): string => {
        const drsValue = carData[driverNumber]?.drs;
        if (drsValue === undefined) return 'N/A';
        return drsValue === 1 ? '开启' : '关闭';
    };
    
    // 获取驾驶员的最新速度
    const getSpeed = (driverNumber: number): string => {
        const speed = carData[driverNumber]?.speed;
        return speed !== undefined ? `${speed} km/h` : 'N/A';
    };
    
    // 获取驾驶员的最新间隔
    const getInterval = (driverNumber: number): string => {
        const interval = intervals[driverNumber]?.interval;
        if (interval === undefined) return 'N/A';
        return interval === 0 ? 'LEADER' : `+${interval.toFixed(3)}s`;
    };
    
    // 获取驾驶员的最新圈速
    const getLapTime = (driverNumber: number): string => {
        const lapDuration = laps[driverNumber]?.lap_duration;
        if (lapDuration === undefined) return 'N/A';
        const minutes = Math.floor(lapDuration / 60);
        const seconds = (lapDuration % 60).toFixed(3);
        return `${minutes}:${seconds.padStart(6, '0')}`;
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Driver Positions</ThemedText>
            <ThemedText>Last updated: {lastUpdated}</ThemedText>
            <FlatList
                data={sortedDrivers}
                keyExtractor={(item) => item.driver_number.toString()}
                ItemSeparatorComponent={renderSeparator}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.positionContainer}>
                            <Text style={styles.positionText}>{positions[item.driver_number]?.position ?? '-'}</Text>
                            <Text style={styles.driverName}>{item.name} (#{item.driver_number})</Text>
                        </View>
                        <View style={styles.dataContainer}>
                            <View style={styles.dataRow}>
                                <ThemedText style={styles.dataLabel}>速度:</ThemedText>
                                <ThemedText style={styles.dataValue}>{getSpeed(item.driver_number)}</ThemedText>
                            </View>
                            <View style={styles.dataRow}>
                                <ThemedText style={styles.dataLabel}>DRS:</ThemedText>
                                <ThemedText style={styles.dataValue}>{getDrsStatus(item.driver_number)}</ThemedText>
                            </View>
                            <View style={styles.dataRow}>
                                <ThemedText style={styles.dataLabel}>间隔:</ThemedText>
                                <ThemedText style={styles.dataValue}>{getInterval(item.driver_number)}</ThemedText>
                            </View>
                            <View style={styles.dataRow}>
                                <ThemedText style={styles.dataLabel}>最新圈速:</ThemedText>
                                <ThemedText style={styles.dataValue}>{getLapTime(item.driver_number)}</ThemedText>
                            </View>
                        </View>
                    </View>
                )}
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    itemContainer: {
        flexDirection: 'column',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: 'rgba(200, 200, 200, 0.1)'
    },
    positionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    positionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
        minWidth: 30
    },
    driverName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    dataContainer: {
        marginLeft: 40
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    dataLabel: {
        fontSize: 14,
        opacity: 0.8
    },
    dataValue: {
        fontSize: 14,
        fontWeight: '500'
    }
})

export default RaceMonitor;
