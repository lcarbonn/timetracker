import { baserowExecute } from "~/server/useFetch/baserrowFetch"
import { fetchPausesOfTrack } from "~/server/useFetch/useFetchPauseTrack"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await baserowExecute(event, fetchPausesOfTrack, Number(query.timeId))
})