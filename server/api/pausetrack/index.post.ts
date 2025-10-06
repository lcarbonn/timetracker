import { IPauseTrackPost } from "~/utils/tablePauseTrack"
import { fetchCreatePauseTrack } from "~/server/useFetch/useFetchPauseTrack"
import { baserowExecute } from "~/server/useFetch/baserrowFetch"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await baserowExecute(event, fetchCreatePauseTrack, body as IPauseTrackPost)
})