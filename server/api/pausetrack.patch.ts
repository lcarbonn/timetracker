import { IPauseTrack } from "~/utils/tablePauseTrack"
import { fetchUpdatePauseTrack } from "../useFetch/useFetchPauseTrack"
import { baserowExecute } from "../useFetch/baserrowFetch"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await baserowExecute(event, fetchUpdatePauseTrack, body as IPauseTrack)

})