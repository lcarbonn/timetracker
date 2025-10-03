import { ITimeTrack } from '~/utils/tableTimeTrack'
import { fetchUpdateTimeTrack} from '../useFetch/useFetchTimeTrack'
import { baserowExecute } from '../useFetch/baserrowFetch'

export default defineEventHandler(async (event) => {
  // try {
    const { user } = await requireUserSession(event)
    const body = await readBody(event)

    // const timeTrack = await fetchUpdateTimeTrack(body as ITimeTrack)
    return await baserowExecute(event, fetchUpdateTimeTrack, body as ITimeTrack)

    
    // return (timeTrack)
  // } catch (error) {
  //   return (error)    
  // }
})