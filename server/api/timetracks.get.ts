import { fetchTimeTracksTodayUid, fetchTimeTracksWeekUid } from '../useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    // const session = await getUserSession(event)
    const query = getQuery(event)
    const uid = Number(query.uid)
    const week = Number(query.week)
    if(week) {
      return await fetchTimeTracksWeekUid(uid, week)
    }
    return await fetchTimeTracksTodayUid(uid)
  } catch (error) {
    return (error)    
  }
})