import { fetchTimeTracks, fetchTimeTracksUid } from '~/utils/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const query = getQuery(event)
    let timeTracks
    if(user.id && query.week) {
      const week = new Number(query.week).valueOf()
    // TODO : get env for server
      timeTracks = await fetchTimeTracksUid(user.id, week)
    } else {
      timeTracks = await fetchTimeTracks()
    }
    
    return (timeTracks)
  } catch (error) {
    console.error(error)
    return (error)    
  }
})