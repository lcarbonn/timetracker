import { IPauseTrack } from "~/utils/tablePauseTrack"
import { fetchUpdatePauseTrack } from "~/server/useFetch/useFetchPauseTrack"
import { baserowExecute } from "~/server/useFetch/baserrowFetch"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await baserowExecute(event, fetchUpdatePauseTrack, body as IPauseTrack)

})