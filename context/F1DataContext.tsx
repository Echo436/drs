import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Constructor } from 'react-native/types/private/Utilities';

// 车手数据类型
export type Driver = {
    name: string;
    surname: string;
    nationality: string;
    birthday: string;
    number: number;
    shortName: string;
    url: string;
};
// 制造商数据类型
export type Team = {
    teamId: string;
    teamName: string;
    country: string;
    firstAppearance: number;
    constructorsChampionships: number;
    driversChampionships: number;
    url: string;
}
// 赛道数据类型
export type Circuit = {
    circuitId: string;
    circuitName: string;
    country: string;
    city: string;
    circuitLength: string;
    lapRecord: string;
    firstParticipationYear: number;
    corners: number;
    fastestLapDriverId: string;
    fastestLapTeamId: string;
    fastestLapYear: number;
    url: string;
}
// 比赛阶段数据类型
export type Schedule = {
    race: Session;
    qualy: Session;
    fp1: Session;
    fp2: Session;
    fp3: Session;
    sprintQualy: Session;
    sprintRace: Session;
}
// 比赛时间数据类型
export type Session = {
    date: string;
    time: string;
}
// 最快圈数据类型
export type FastLap = {
    fast_lap: string;
    fast_lap_driver_id: string;
    fast_lap_team_id: string;
};
// 大奖赛数据类型
export type GrandPrix = {
    raceId: string;
    championshipId: string;
    raceName: string;
    schedule: Schedule;
    laps: number;
    round: number;
    url: string;
    fast_lap: FastLap;
    circuit: Circuit;
    winner: Driver;
    teamWinner: Team;
};
// 车手（含成绩）数据类型
export type DriverStanding = {
    classificationId: number;
    driverId: string;
    teamId: string;
    points: number;
    position: number;
    wins: number;
    driver: Driver;
    team: Team;
}
// 制造商（含成绩）数据类型
export type ConstructorStanding = {
    classificationId: number;
    teamId: string;
    points: number;
    position: number;
    wins: number;
    team: Team;
}
// 定义Context的类型
type F1DataContextType = {
    grandPrixList: GrandPrix[];
    driverList: DriverStanding[];
    constructorList: ConstructorStanding[];
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
};

// 创建Context
const F1DataContext = createContext<F1DataContextType | undefined>(undefined);

// Provider组件
export const F1DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [grandPrixList, setGrandPrixList] = useState<GrandPrix[]>([]);
    const [driverList, setDriverList] = useState<DriverStanding[]>([]);
    const [constructorList, setConstructorList] = useState<ConstructorStanding[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 获取F1大奖赛数据的函数
    const fetchGPData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('https://f1api.dev/api/current');
            const data = await response.json();

            if (data && data.races && Array.isArray(data.races)) {
                setGrandPrixList(data.races);
            } else {
                setError('大奖赛数据格式不正确');
            }
        } catch (err) {
            setError('获取大奖赛数据失败，请稍后重试');
            console.error('Error fetching F1 race data:', err);
        } finally {
            setLoading(false);
        }
    };

    // 获取F1车手数据的函数
    const fetchDriverData = async () => {
        try {
            const response = await fetch('https://f1api.dev/api/current/drivers-championship');
            const data = await response.json();

            if (data && data.drivers_championship && Array.isArray(data.drivers_championship)) {
                setDriverList(data.drivers_championship);
            } else {
                setError('车手数据格式不正确');
            }
        } catch (err) {
            setError('获取车手数据失败，请稍后重试');
            console.error('Error fetching F1 driver data:', err);
        } finally {
            setLoading(false);
        }
    };

    // 获取F1制造商数据的函数
    const fetchConstructorData = async () => {
        try {
            const response = await fetch('https://f1api.dev/api/current/constructors-championship');
            const data = await response.json();

            if (data && data.constructors_championship && Array.isArray(data.constructors_championship)) {
                setConstructorList(data.constructors_championship);
            } else {
                setError('制造商数据格式不正确');
            }
        } catch (err) {
            setError('获取制造商数据失败，请稍后重试');
            console.error('Error fetching F1 constructor data:', err);
        } finally {
            setLoading(false);
        }
    };

    // 应用启动时自动获取数据
    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([fetchGPData(), fetchDriverData(), fetchConstructorData()]);
        };
        fetchAllData();
    }, []);

    // 提供刷新数据的方法
    const refreshData = async () => {
        await Promise.all([fetchGPData(), fetchDriverData(), fetchConstructorData]);
    };

    // 提供Context值
    const contextValue: F1DataContextType = {
        grandPrixList,
        driverList,
        constructorList,
        loading,
        error,
        refreshData,
    };

    return <F1DataContext.Provider value={contextValue}>{children}</F1DataContext.Provider>;
};

// 自定义Hook，方便组件使用F1数据
export const useF1Data = (): F1DataContextType => {
    const context = useContext(F1DataContext);
    if (context === undefined) {
        throw new Error('useF1Data must be used within a F1DataProvider');
    }
    return context;
};