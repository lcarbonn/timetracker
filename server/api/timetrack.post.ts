import { ITimeTrack } from '~/utils/tableTimeTrack'
import { fetchCreateTimeTrack} from '../useFetch/useFetchTimeTrack'
import { baserowExecute } from '../useFetch/baserrowFetch'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await baserowExecute(event, fetchCreateTimeTrack, body as ITimeTrack)
})