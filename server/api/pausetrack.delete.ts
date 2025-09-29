import { fetchDeletePauseTrack } from '../useFetch/useFetchPauseTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const query = getQuery(event)
    let pauseTrack
    if(query.id) {
      pauseTrack = await fetchDeletePauseTrack(new Number(query.id).valueOf())
    }
    return (pauseTrack)
  } catch (error) {
    return (error)    
  }
})