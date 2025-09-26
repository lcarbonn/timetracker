import { ITimeTrack } from '~/types/tableTimeTrack'
import { fetchUpdateTimeTrack} from '../utils/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const body = await readBody(event)

    const timeTrack = await fetchUpdateTimeTrack(body as ITimeTrack)
    
    return (timeTrack)
  } catch (error) {
    console.error(error)
    return (error)    
  }
})