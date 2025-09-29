import { ITimeTrack } from '~/utils/tableTimeTrack'
import { fetchCreateTimeTrack} from '../useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const body = await readBody(event)

    const timeTrack = await fetchCreateTimeTrack(body as ITimeTrack)

    return (timeTrack)
  } catch (error) {
    return (error)    
  }
})