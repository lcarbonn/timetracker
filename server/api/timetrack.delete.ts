import { fetchDeleteTimeTrack} from '../useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const query = getQuery(event)
    let timeTrack
    if(query.id) {
      timeTrack = await fetchDeleteTimeTrack(new Number(query.id).valueOf())
    }
    return (timeTrack)
  } catch (error) {
    return (error)    
  }
})