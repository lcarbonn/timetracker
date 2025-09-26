import { IPauseTrackPost } from "~/types/tablePauseTrack"
import { fetchCreatePauseTrack } from "../utils/useFetchPauseTrack"

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const body = await readBody(event)

    const pauseTrack = await fetchCreatePauseTrack(body as IPauseTrackPost)

    return (pauseTrack)
  } catch (error) {
    console.error(error)
    return (error)    
  }
})