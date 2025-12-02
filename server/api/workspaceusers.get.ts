import { baserowExecute } from "../useFetch/baserrowFetch"
import { fetchWorkspaceUsers } from "../useFetch/useFetchWorkspace"

export default defineEventHandler(async (event) => {
      const { user } = await requireUserSession(event)
      return await baserowExecute(event, fetchWorkspaceUsers)
})