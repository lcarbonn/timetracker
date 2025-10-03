import { baserowExecute } from '../useFetch/baserrowFetch'
import { fetchDeletePauseTrack } from '../useFetch/useFetchPauseTrack'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await baserowExecute(event, fetchDeletePauseTrack, Number(query.id))
})