import { fetchDeleteTimeTrack} from '../useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const query = getQuery(event)
    let id
    if(query.id) {
      id = await fetchDeleteTimeTrack(new Number(query.id).valueOf())
    }
    return (id)
  } catch (error) {
    return (error)    
  }
})