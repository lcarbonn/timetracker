import { ITimeTrack } from '~/utils/tableTimeTrack'
import { fetchUpdateTimeTrack} from '../useFetch/useFetchTimeTrack'
import { baserowExecute } from '../useFetch/baserrowFetch'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await baserowExecute(event, fetchUpdateTimeTrack, body as ITimeTrack)
})