import { baserowExecute } from "../useFetch/baserrowFetch"
import { fetchPausesOfTrack } from "../useFetch/useFetchPauseTrack"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await baserowExecute(event, fetchPausesOfTrack, Number(query.timeId))
})