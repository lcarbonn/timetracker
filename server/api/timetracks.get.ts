import { fetchTimeTracksTodayUid, fetchTimeTracksWeekUid } from '../utils/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const query = getQuery(event)
    let timeTracks
    if(user.id) {
      if(query.week) {
        const week = new Number(query.week).valueOf()
        timeTracks = await fetchTimeTracksWeekUid(user.id, week)
      }
      if (query.today) {
        timeTracks = await fetchTimeTracksTodayUid(user.id)
      }
      // else {
      //   timeTracks = await fetchTimeTracks()
      // }
    }    
    return (timeTracks)
  } catch (error) {
    console.error(error)
    return (error)    
  }
})