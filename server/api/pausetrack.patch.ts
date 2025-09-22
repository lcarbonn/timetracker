import { IPauseTrack } from "~/types/tablePauseTrack"
import { fetchUpdatePauseTrack } from "~/utils/useFetchPauseTrack"

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const body = await readBody(event)

    const pauseTrack = await fetchUpdatePauseTrack(body as IPauseTrack)
    
    return (pauseTrack)
  } catch (error) {
    console.error(error)
    return (error)    
  }
})