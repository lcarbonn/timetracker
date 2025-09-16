import { ITimeTrack } from '~/types/tableTimeTrack'
import { fetchCreateTimeTrack} from '~/utils/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const body = await readBody(event)

    const timeTrack = await fetchCreateTimeTrack(body as ITimeTrack)

    return (timeTrack)
  } catch (error) {
    console.error(error)
    return (error)    
  }
})