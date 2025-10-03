import { baserowExecute } from '../useFetch/baserrowFetch'
import { fetchDeleteTimeTrack} from '../useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await baserowExecute(event, fetchDeleteTimeTrack, Number(query.id))

})