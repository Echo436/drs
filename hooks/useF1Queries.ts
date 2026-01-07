import {
  getConstructorStandingsBySeason,
  getDriverStandingsBySeason,
  getQualifyingResultsBySeasonAndRound,
  getRaceDetails,
  getRaceResultsBySeasonAndRound,
  getRacesBySeason,
  getResultsBySeasonAndPosition,
  getSeasons,
  getSprintResultsBySeasonAndRound,
} from '@/apis/jolpica'
import { getRaceDetails as getExtraRaceDetails } from '@/apis/f1api'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { SplashScreen } from 'expo-router'
import { useMemo } from 'react'

export const jolpicaKeys = {
  all: ['jolpica'] as const,
  seasons: () => [...jolpicaKeys.all, 'seasons'] as const,
  races: (season: string) => [...jolpicaKeys.all, 'races', season] as const,
  racesPosition: (season: string, position: number) =>
    [...jolpicaKeys.all, 'races', 'position', season, position] as const,
  driverStandings: (season: string) =>
    [...jolpicaKeys.all, 'driverStandings', season] as const,
  constructorStandings: (season: string) =>
    [...jolpicaKeys.all, 'constructorStandings', season] as const,
  raceDetails: (season: string, round: string) =>
    [...jolpicaKeys.all, 'raceDetails', season, round] as const,
  qualiResults: (season: string, round: string) =>
    [...jolpicaKeys.all, 'qualiResults', season, round] as const,
  sprintResults: (season: string, round: string) =>
    [...jolpicaKeys.all, 'sprintResults', season, round] as const,
  raceResults: (season: string, round: string) =>
    [...jolpicaKeys.all, 'raceResults', season, round] as const,
}

export const f1apiKeys = {
  all: ['f1api'] as const,
  raceDetails: (season: string, round: string) =>
    [...f1apiKeys.all, 'raceDetails', season, round] as const,
}

const fetchAndFormatSeasons = async () => {
  // [{ ..., season: "2024" }, ...]
  const seasons = await getSeasons()
  // ["2024", "2023", ..., "1950"]
  return seasons.map((season: { season: string }) => season.season).reverse()
}

export const useSeasonsQuery = () => {
  return useQuery({
    queryKey: jolpicaKeys.seasons(),
    queryFn: fetchAndFormatSeasons,
    staleTime: Infinity,
  })
}

// 一个赛季的所有比赛，包含前三名结果
export const useRacesQuery = (season: string) => {
  const queryClient = useQueryClient()
  const results = useQueries({
    queries: [
      {
        queryKey: jolpicaKeys.races(season),
        queryFn: () => getRacesBySeason(season),
        staleTime: Infinity,
      },
      {
        queryKey: jolpicaKeys.racesPosition(season, 1),
        queryFn: () => getResultsBySeasonAndPosition(season, 1),
      },
      {
        queryKey: jolpicaKeys.racesPosition(season, 2),
        queryFn: () => getResultsBySeasonAndPosition(season, 2),
      },
      {
        queryKey: jolpicaKeys.racesPosition(season, 3),
        queryFn: () => getResultsBySeasonAndPosition(season, 3),
      },
    ],
  })

  // 合并数据
  const mergedData = useMemo(() => {
    const [racesQuery, p1Query, p2Query, p3Query] = results

    // 如果任何一个查询还在加载中，返回 undefined
    if (results.some((result) => result.isLoading)) {
      return undefined
    }

    // 如果没有赛事数据，返回空数组
    if (!racesQuery) {
      return []
    }

    setTimeout(() => {
      SplashScreen.hideAsync()
    }, 100)

    const races = racesQuery.data ?? []
    const p1Races = p1Query.data ?? []
    const p2Races = p2Query.data ?? []
    const p3Races = p3Query.data ?? []

    // 合并前三名的比赛结果到对应的 race 对象
    return races.map((race: { round: string }) => {
      const p1Race = p1Races.find(
        (r: { round: string }) => r.round === race.round,
      )
      const p2Race = p2Races.find(
        (r: { round: string }) => r.round === race.round,
      )
      const p3Race = p3Races.find(
        (r: { round: string }) => r.round === race.round,
      )

      return {
        ...race,
        Results: [
          ...(p1Race?.Results || []),
          ...(p2Race?.Results || []),
          ...(p3Race?.Results || []),
        ],
      }
    })
  }, [results])

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: jolpicaKeys.races(season),
    })
  }

  return {
    data: mergedData,
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
    errors: results.map((result) => result.error),
    refetch,
  }
}

// 赛季车手积分榜
export const useDriverStandingsQuery = (season: string) => {
  return useQuery({
    queryKey: jolpicaKeys.driverStandings(season),
    queryFn: () => getDriverStandingsBySeason(season),
  })
}

// 赛季车队积分榜
export const useConstructorStandingsQuery = (season: string) => {
  return useQuery({
    queryKey: jolpicaKeys.constructorStandings(season),
    queryFn: () => getConstructorStandingsBySeason(season),
  })
}

export const useRaceDetailsQuery = (
  season: string,
  round: string,
  initialData: any,
) => {
  return useQuery({
    queryKey: jolpicaKeys.raceDetails(season, round),
    queryFn: () => getRaceDetails(season, round),
    initialData,
  })
}

export const useExtraRaceDetailsQuery = (season: string, round: string) => {
  return useQuery({
    queryKey: f1apiKeys.raceDetails(season, round),
    queryFn: () => getExtraRaceDetails(season, round),
  })
}

export const useQualiResultsQuery = (season: string, round: string) => {
  return useQuery({
    queryKey: jolpicaKeys.qualiResults(season, round),
    queryFn: () => getQualifyingResultsBySeasonAndRound(season, round),
  })
}

export const useSprintResultsQuery = (season: string, round: string) => {
  return useQuery({
    queryKey: jolpicaKeys.sprintResults(season, round),
    queryFn: () => getSprintResultsBySeasonAndRound(season, round),
  })
}

export const useRaceResultsQuery = (season: string, round: string) => {
  return useQuery({
    queryKey: jolpicaKeys.raceResults(season, round),
    queryFn: () => getRaceResultsBySeasonAndRound(season, round),
  })
}
