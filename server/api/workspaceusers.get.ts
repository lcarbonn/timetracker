import { fetchWorkspaceUsers } from "~/server/useFetch/useFetchWorkspace"
import { baserowExecute } from "~/server/useFetch/baserrowFetch"

export default defineEventHandler(async (event) => {
      return await baserowExecute(event, fetchWorkspaceUsers)
})