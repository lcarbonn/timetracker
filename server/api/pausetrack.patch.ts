import { IPauseTrack } from "~/utils/tablePauseTrack"
import { fetchUpdatePauseTrack } from "../useFetch/useFetchPauseTrack"

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