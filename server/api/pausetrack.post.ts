import { IPauseTrackPost } from "~/utils/tablePauseTrack"
import { fetchCreatePauseTrack } from "../useFetch/useFetchPauseTrack"

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const body = await readBody(event)

    const pauseTrack = await fetchCreatePauseTrack(body as IPauseTrackPost)

    return (pauseTrack)
  } catch (error) {
    return (error)    
  }
})