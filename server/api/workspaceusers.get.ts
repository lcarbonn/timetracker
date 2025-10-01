import { fetchWorkspaceUsers } from "../useFetch/useFetchWorkspace"
import { baserowExecute } from "../useFetch/baserrowFetch"

export default defineEventHandler(async (event) => {
      return await baserowExecute(event, fetchWorkspaceUsers)
})