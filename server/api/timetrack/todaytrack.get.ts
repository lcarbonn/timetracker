import { baserowExecute } from '~/server/useFetch/baserrowFetch'
import { fetchTodayTrack} from '~/server/useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const uid = Number(query.uid)

    return await baserowExecute(event, fetchTodayTrack, uid)
    
})