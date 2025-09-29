import { fetchPauseTracksForTimeTrack } from "../useFetch/useFetchPauseTrack"

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const query = getQuery(event)
    let pauseTracks
    if(query.timeId) {
        const timeId = new Number(query.timeId).valueOf()
        pauseTracks = await fetchPauseTracksForTimeTrack(timeId)
    }    
    return (pauseTracks)
  } catch (error) {
    return (error)    
  }
})