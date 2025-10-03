
import { baserowExecute } from '../useFetch/baserrowFetch'
import { fetchTracksOfTheWeek } from '../useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const uid = Number(query.uid)
    const week = Number(query.week)
    if(week) {
      return await baserowExecute(event, fetchTracksOfTheWeek, uid, week)
    }
})