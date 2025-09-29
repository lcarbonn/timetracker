import { fetchTodayTimeTrack} from '../useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)

    const timeTrack = await fetchTodayTimeTrack(user.id)
    
    return (timeTrack)
  } catch (error) {
    return (error)    
  }
})