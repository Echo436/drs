import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 车手数据类型
export type Driver = {
    driverId: string;
    permanentNumber: string,
    code: string,
    givenName: string;
    familyName: string;
    name: string;
    surname: string;
    nationality: string;
    birthday: string;
    dateOfBirth: string;
    number: number;
    shortName: string;
    url: string;
    teamId: string;
};
// 制造商数据类型
export type Team = {
    teamId: string;
    teamName: string;
    team_colour: string;
    country: string;
    firstAppearance: number;
    constructorsChampionships: number;
    driversChampionships: number;
    url: string;
}
export type Constructor = {
    constructorId: string;
    uri: string;
    name: string;
    nationality: string;
}
// 赛道数据类型
export type Circuit = {
    circuitId: string;
    circuitName: string;
    name: string;
    country: string;
    city: string;
    circuitLength: string;
    length: string;
    lapRecord: string;
    firstParticipationYear: number;
    corners: number;
    numberOfCorners: number;
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
export type Race = {
    raceId: string;
    championshipId: string;
    name: string;
    raceName: string;
    schedule: Schedule;
    laps: number;
    round: string;
    url: string;
    fast_lap: FastLap;
    circuit: Circuit;
    winner: Driver;
    teamWinner: Team;
    date: string;
};
// 车手（排名）数据类型
export type DriverStanding = {
    classificationId: number;
    driverId: string;
    teamId: string;
    points: number;
    position: number;
    positionText: string;
    wins: number;
    driver: Driver;
    Driver: Driver;
    team: Team;
    Constructors: Constructor[];
}
export type Result = {
    finishingPosition: number;
    gridPosition: number;
    raceTime: string;
    pointsObtained: number;
    retired: boolean;
};
export type DriverResult = {
    race: Race;
    result: Result;
    sprintResult: Result;
};
// 制造商（含成绩）数据类型
export type ConstructorStanding = {
    classificationId: number;
    teamId: string;
    points: number;
    position: number;
    positionText: string;
    wins: number;
    team: Team;
    Constructor: Constructor;
}
export type Drivers_openf1 = {
    broadcast_name: string;
    country_code: string;
    driver_number: number;
    first_name: string;
    full_name: string;
    headshot_url: string;
    last_name: string;
    meeting_key: number;
    name_acronym: string;
    session_key: number;
    team_colour: string;
    team_name: string;
}
// 定义Context的类型
type DataType = 'grandPrixList' | 'driverStandingList' | 'constructorList' | 'nextRace' | 'lastRace';

type F1DataContextType = {
    grandPrixList: Race[];
    driverStandingList: DriverStanding[];
    constructorList: ConstructorStanding[];
    nextRace: Race | null;
    lastRace: Race | null;
    grandPrixLoading: boolean;
    driverLoading: boolean;
    constructorLoading: boolean;
    nextRaceLoading: boolean;
    lastRaceLoading: boolean;
    refreshData: (dataTypes?: DataType[]) => Promise<void>;
};

// 创建Context
const F1DataContext = createContext<F1DataContextType | undefined>(undefined);

// Provider组件
export const F1DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [grandPrixList, setGrandPrixList] = useState<Race[]>([]);
    const [driverList, setDriverList] = useState<DriverStanding[]>([]);
    const [constructorList, setConstructorList] = useState<ConstructorStanding[]>([]);
    const [nextRace, setNextRace] = useState<Race | null>(null);
    const [lastRace, setLastRace] = useState<Race | null>(null);
    const [grandPrixLoading, setGrandPrixLoading] = useState(true);
    const [driverListLoading, setDriverListLoading] = useState(true);
    const [constructorListLoading, setConstructorListLoading] = useState(true);
    const [nextRaceLoading, setNextRaceLoading] = useState(true);
    const [lastRaceLoading, setLastRaceLoading] = useState(true);

    const fetchGPListData = async () => {
        setGrandPrixLoading(true);
        try {
            const response = await fetch('https://f1api.dev/api/current')
                .then(response => response.json());
            if (response && response.races && Array.isArray(response.races)) {
                setGrandPrixList(response.races);
            }
        } catch (err) {
            console.error('Error fetching F1 race data:', err);
        } finally {
            setGrandPrixLoading(false);
        }
    };

    const fetchNextRaceData = async () => {
        try {
            const response = await fetch('https://f1api.dev/api/current/next')
                .then(response => response.json());
            if (response && response.race && Array.isArray(response.race)) {
                setNextRace(response.race[0]);
            }
        } catch (err) {
            console.error('Error fetching F1 next race data:', err);
        } finally {
            setNextRaceLoading(false);
        }
    };

    const fetchLastRaceData = async () => {
        try {
            const response = await fetch('https://f1api.dev/api/current/last')
               .then(response => response.json());
            if (response && response.races && Array.isArray(response.races)) {
                setLastRace(response.races[0]);
            }
        } catch (err) {
            console.error('Error fetching F1 last race data:', err);
        } finally {
            setLastRaceLoading(false);
        }
    };

    const fetchDriverData = async () => {
        setDriverListLoading(true);
        try {
            const response = await fetch('https://api.jolpi.ca/ergast/f1/2024/driverstandings/')
                .then(response => response.json());
            // if (response && response.drivers_championship && Array.isArray(response.drivers_championship)) {
                setDriverList(response.MRData.StandingsTable.StandingsLists[0].DriverStandings);
            // }
            // const response = await fetch('https://f1api.dev/api/current/drivers-championship')
            //     .then(response => response.json());
            // if (response && response.drivers_championship && Array.isArray(response.drivers_championship)) {
            //     setDriverList(response.drivers_championship);
            // }
        } catch (err) {
            console.error('Error fetching F1 driver data:', err);
        } finally {
            setDriverListLoading(false);
        }
    };

    const fetchConstructorData = async () => {
        setConstructorListLoading(true);
        try {
            const response = await fetch('https://f1api.dev/api/current/constructors-championship')
                .then(response => response.json());
            if (response && response.constructors_championship && Array.isArray(response.constructors_championship)) {
                setConstructorList(response.constructors_championship);
            }
        } catch (err) {
            console.error('Error fetching F1 constructor data:', err);
        } finally {
            setConstructorListLoading(false);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([
                fetchGPListData(),
                fetchDriverData(),
                fetchConstructorData(),
                fetchNextRaceData(),
                fetchLastRaceData()
            ]);
        };
        fetchAllData();
    }, []);

    const refreshData = async (dataTypes?: DataType[]) => {
        const fetchFunctions = {
            grandPrixList: fetchGPListData,
            driverStandingList: fetchDriverData,
            constructorList: fetchConstructorData,
            nextRace: fetchNextRaceData,
            lastRace: fetchLastRaceData
        };
    
        const functionsToExecute = dataTypes
            ? dataTypes.map(type => fetchFunctions[type])
            : Object.values(fetchFunctions);
    
        await Promise.all(functionsToExecute.map(fn => fn()));
    };

    const contextValue: F1DataContextType = {
        grandPrixList,
        driverStandingList: driverList,
        constructorList,
        nextRace,
        lastRace,
        grandPrixLoading,
        driverLoading: driverListLoading,
        constructorLoading: constructorListLoading,
        nextRaceLoading,
        lastRaceLoading,
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