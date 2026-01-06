import axios from 'axios'

const BASE = 'https://api.jolpi.ca/ergast/f1'

export const getSeasons = async () => {
  const { data } = await axios.get(`${BASE}/seasons/?limit=100`)
  return data.MRData.SeasonTable.Seasons
}

export const getRacesBySeason = async (season: string) => {
  const { data } = await axios.get(`${BASE}/${season}/races`)
  return data.MRData.RaceTable.Races
}

export const getResultsBySeasonAndPosition = async (
  season: string,
  position: number,
) => {
  const { data } = await axios.get(`${BASE}/${season}/results/${position}`)
  return data.MRData.RaceTable.Races
}

export const getDriverStandingsBySeason = async (season: string) => {
  const { data } = await axios.get(`${BASE}/${season}/driverstandings/`)
  return data.MRData.StandingsTable.StandingsLists[0].DriverStandings
}

export const getConstructorStandingsBySeason = async (season: string) => {
  const { data } = await axios.get(`${BASE}/${season}/constructorstandings/`)
  return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
}

export const getRaceDetails = async (season: string, round: string) => {
  const { data } = await axios.get(`${BASE}/${season}/${round}/races`)
  return data.MRData.RaceTable.Races[0]
}

export const getSprintResultsBySeasonAndRound = async (
  season: string,
  round: string,
) => {
  const { data } = await axios.get(`${BASE}/${season}/${round}/sprint`)
  return data.MRData.RaceTable.Races[0].SprintResults
}

export const getQualifyingResultsBySeasonAndRound = async (
  season: string,
  round: string,
) => {
  const { data } = await axios.get(`${BASE}/${season}/${round}/qualifying`)
  return data.MRData.RaceTable.Races[0].QualifyingResults
}

export const getRaceResultsBySeasonAndRound = async (
  season: string,
  round: string,
) => {
  const { data } = await axios.get(`${BASE}/${season}/${round}/results`)
  return data.MRData.RaceTable.Races[0].Results
}
