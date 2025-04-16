import { DateTime } from 'luxon';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Season = {
    season: string;
}
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
    Location: {
        lat: string;
        long: string;
        locality: string;
        country: string;
    }
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
    season: string;
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
    Circuit: Circuit;
    winner: Driver;
    teamWinner: Team;
    date: string;
    time: string;
    FirstPractice: Session;
    SecondPractice: Session;
    ThirdPractice: Session;
    Qualifying: Session;
    Sprint: Session;
    SprintQualifying: Session;
    Results: Result[];
    QualifyingResults: Result[];
    SprintResults: Result[];
};
export type Result = {
    number: string;
    position: string;
    points: string;
    Driver: Driver;
    Constructor: Constructor;
    Q1: string;
    Q2: string;
    Q3: string;
    grid: string;
    laps: string;
    status: string;
    Time: {
        millis: string;
        time: string;
    };
    FastestLap: {
        rank: string;
        lap: string;
        Time: {
            time: string;
        };
    }
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
    seasons: Season[];
    selectedSeason: string;
    setSelectedSeason: (season: string) => void;
    grandPrixList: Race[];
    currentRound: string;
    driverStandingList: DriverStanding[];
    constructorList: ConstructorStanding[];
    grandPrixLoading: boolean;
    driverLoading: boolean;
    constructorLoading: boolean;
    setDriverList: (driverList: DriverStanding[]) => void;
    setConstructorList: (constructorList: ConstructorStanding[]) => void;
    setGrandPrixList: (grandPrixList: Race[]) => void;
};

// 创建Context
const F1DataContext = createContext<F1DataContextType | undefined>(undefined);

// Provider组件
export const F1DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [seasons, setSeasons] = useState<Season[]>([{ season: 'current'}]);
    const [selectedSeason, setSelectedSeason] = useState<string>('current');
    const [grandPrixList, setGrandPrixList] = useState<Race[]>([]);
    const [currentRound, setCurrentRound] = useState<string>('0');
    const [driverList, setDriverList] = useState<DriverStanding[]>([]);
    const [constructorList, setConstructorList] = useState<ConstructorStanding[]>([]);
    const [grandPrixLoading, setGrandPrixLoading] = useState(true);
    const [driverListLoading, setDriverListLoading] = useState(true);
    const [constructorListLoading, setConstructorListLoading] = useState(true);
    const [isSeasonListFetched, setIsSeasonListFetched] = useState(false);

    const fetchSeasonListData = () => {
        fetch('https://api.jolpi.ca/ergast/f1/seasons/?limit=100')
            .then(response => response.json())
            .then(data => {
                const seasonsData = data.MRData.SeasonTable.Seasons.map(season => ({
                    season: season.season
                })).reverse();
                setSeasons(seasonsData);
                setSelectedSeason(seasonsData[0].season);
            })
    }

    const fetchGPListData = async (year: string) => {
        setGrandPrixLoading(true);
        try {
            const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/races`)
                .then(response => response.json());
            const data: Race[] = response.MRData.RaceTable.Races;
            setGrandPrixList(data);
            for (const race of data) {
                const date = DateTime.fromISO(`${race.date}T${race.time}`);
                if (date.plus({ day: 2 }) > DateTime.now()) {
                    setCurrentRound(race.round);
                    break;
                }
            }
        } catch (err) {
            console.error('Error fetching F1 race data:', err);
        } finally {
            setGrandPrixLoading(false);
        }
    };

    const fetchDriverListData = async (year: string) => {
        setDriverListLoading(true);
        try {
            const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverstandings/`)
                .then(response => response.json());
            setDriverList(response.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        } catch (err) {
            console.error('Error fetching F1 driver data:', err);
        } finally {
            setDriverListLoading(false);
        }
    };

    const fetchConstructorListData = async (year: string) => {
        setConstructorListLoading(true);
        try {
            const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/constructorstandings/`)
                .then(response => response.json());
            setConstructorList(response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
        } catch (err) {
            console.error('Error fetching F1 constructor data:', err);
        } finally {
            setConstructorListLoading(false);
        }
    };

    useEffect(() => {
        if (!isSeasonListFetched) {
            fetchSeasonListData();
            setIsSeasonListFetched(true);
        }
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([
                fetchGPListData(selectedSeason),
                fetchDriverListData(selectedSeason),
                fetchConstructorListData(selectedSeason)
            ]);
        };
        fetchAllData();
    }, [selectedSeason]);

    const contextValue: F1DataContextType = {
        seasons,
        selectedSeason,
        setSelectedSeason,
        grandPrixList,
        currentRound,
        driverStandingList: driverList,
        constructorList,
        grandPrixLoading,
        driverLoading: driverListLoading,
        constructorLoading: constructorListLoading,
        setDriverList,
        setConstructorList,
        setGrandPrixList
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