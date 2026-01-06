import axios from 'axios'

const BASE = 'https://f1api.dev/api'

export const getRaceDetails = async (season: string, round: string) => {
  const { data } = await axios.get(`${BASE}/${season}/${round}`)
  return data.MRData.RaceTable.Races[0]
}
