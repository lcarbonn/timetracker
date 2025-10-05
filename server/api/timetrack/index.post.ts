import { ITimeTrack } from '~/utils/tableTimeTrack'
import { fetchCreateTimeTrack} from '~/server/useFetch/useFetchTimeTrack'
import { baserowExecute } from '~/server/useFetch/baserrowFetch'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await baserowExecute(event, fetchCreateTimeTrack, body as ITimeTrack)
})