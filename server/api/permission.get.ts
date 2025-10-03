import { baserowExecute } from "../useFetch/baserrowFetch"
import { fetchWorkspacePermisssions } from "../useFetch/useFetchWorkspace"

export default defineEventHandler(async (event) => {
    // const { user } = await requireUserSession(event)
    const session = await getUserSession(event)
    let isAdmin = false

    
    if(session.secure) {
      const permissions = await fetchWorkspacePermisssions(session.secure.access_token)
      // const permissions = await baserowExecute(event, fetchWorkspacePermisssions, session.secure.access_token)
      permissions.forEach(permission => {
       isAdmin = isAdmin || Boolean(permission.permissions.is_admin)
      });
    }

    return (isAdmin)
})