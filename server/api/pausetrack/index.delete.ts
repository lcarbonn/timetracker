import { baserowExecute } from '~/server/useFetch/baserrowFetch'
import { fetchDeletePauseTrack } from '~/server/useFetch/useFetchPauseTrack'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await baserowExecute(event, fetchDeletePauseTrack, Number(query.id))
})