import { baserowExecute } from "~/server/useFetch/baserrowFetch"
import { fetchDeleteTimeTrack } from "~/server/useFetch/useFetchTimeTrack"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await baserowExecute(event, fetchDeleteTimeTrack, Number(query.id))

})