import { fetchTimeTracks, fetchTimeTracksUid } from '~/utils/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const query = getQuery(event)
    let timeTracks
    if(user.id && query.year) {
      const year = new Number(query.year).valueOf()
    // TODO : get env for server
      timeTracks = await fetchTimeTracksUid(user.id, year)
    } else {
      timeTracks = await fetchTimeTracks()
    }
    
    return (timeTracks)
  } catch (error) {
    console.error(error)
    return (error)    
  }
})