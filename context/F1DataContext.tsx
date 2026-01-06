import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react'

export type Season = {
  season: string
}
// 车手数据类型
export type Driver = {
  driverId: string
  permanentNumber: string
  code: string
  givenName: string
  familyName: string
  name: string
  surname: string
  nationality: string
  birthday: string
  dateOfBirth: string
  number: number
  shortName: string
  url: string
  teamId: string
}
// 制造商数据类型
export type Team = {
  teamId: string
  teamName: string
  team_colour: string
  country: string
  firstAppearance: number
  constructorsChampionships: number
  driversChampionships: number
  url: string
}
export type Constructor = {
  constructorId: string
  uri: string
  name: string
  nationality: string
}
// 赛道数据类型
export type Circuit = {
  circuitId: string
  circuitName: string
  name: string
  country: string
  city: string
  circuitLength: string
  length: string
  lapRecord: string
  firstParticipationYear: number
  corners: number
  numberOfCorners: number
  fastestLapDriverId: string
  fastestLapTeamId: string
  fastestLapYear: number
  url: string
  Location: {
    lat: string
    long: string
    locality: string
    country: string
  }
}
// 比赛阶段数据类型
export type Schedule = {
  race: Session
  qualy: Session
  fp1: Session
  fp2: Session
  fp3: Session
  sprintQualy: Session
  sprintRace: Session
}
// 比赛时间数据类型
export type Session = {
  date: string
  time: string
}
// 最快圈数据类型
export type FastLap = {
  fast_lap: string
  fast_lap_driver_id: string
  fast_lap_team_id: string
}
// 大奖赛数据类型
export type Race = {
  season: string
  raceId: string
  championshipId: string
  name: string
  raceName: string
  schedule: Schedule
  laps: number
  round: string
  url: string
  fast_lap: FastLap
  circuit: Circuit
  Circuit: Circuit
  winner: Driver
  teamWinner: Team
  date: string
  time: string
  FirstPractice: Session
  SecondPractice: Session
  ThirdPractice: Session
  Qualifying: Session
  Sprint: Session
  SprintQualifying: Session
  Results: Result[]
  QualifyingResults: Result[]
  SprintResults: Result[]
}
export type Result = {
  number: string
  position: string
  points: string
  Driver: Driver
  Constructor: Constructor
  Q1: string
  Q2: string
  Q3: string
  grid: string
  laps: string
  status: string
  Time: {
    millis: string
    time: string
  }
  FastestLap: {
    rank: string
    lap: string
    Time: {
      time: string
    }
  }
}
// 车手（排名）数据类型
export type DriverStanding = {
  classificationId: number
  driverId: string
  teamId: string
  points: number
  position: number
  positionText: string
  wins: number
  driver: Driver
  Driver: Driver
  team: Team
  Constructors: Constructor[]
}

export type DriverResult = {
  race: Race
  result: Result
  sprintResult: Result
}
// 制造商（含成绩）数据类型
export type ConstructorStanding = {
  classificationId: number
  teamId: string
  points: number
  position: number
  positionText: string
  wins: number
  team: Team
  Constructor: Constructor
}
export type Drivers_openf1 = {
  broadcast_name: string
  country_code: string
  driver_number: number
  first_name: string
  full_name: string
  headshot_url: string
  last_name: string
  meeting_key: number
  name_acronym: string
  session_key: number
  team_colour: string
  team_name: string
}

type F1DataContextType = {
  selectedSeason: string
  setSelectedSeason: (season: string) => void
}

// 创建Context
const F1DataContext = createContext<F1DataContextType | undefined>(undefined)

// Provider组件
export const F1DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>(
    new Date().getFullYear().toString(),
  )


  const contextValue: F1DataContextType = {
    selectedSeason,
    setSelectedSeason,
  }

  return (
    <F1DataContext.Provider value={contextValue}>
      {children}
    </F1DataContext.Provider>
  )
}

export const useF1Data = (): F1DataContextType => {
  const context = useContext(F1DataContext)
  if (context === undefined) {
    throw new Error('useF1Data must be used within a F1DataProvider')
  }
  return context
}
