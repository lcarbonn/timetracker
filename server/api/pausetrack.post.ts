import { IPauseTrackPost } from "~/utils/tablePauseTrack"
import { fetchCreatePauseTrack } from "../useFetch/useFetchPauseTrack"
import { baserowExecute } from "../useFetch/baserrowFetch"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await baserowExecute(event, fetchCreatePauseTrack, body as IPauseTrackPost)
})