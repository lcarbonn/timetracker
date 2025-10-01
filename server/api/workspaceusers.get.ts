import { fetchWorkspaceUsers } from "../useFetch/useFetchWorkspace"
import { baserowExecute } from "../useFetch/baserrowFetch"

export default defineEventHandler(async (event) => {

    // const session = await getUserSession(event)
    // if(session.secure) {
      return await baserowExecute(event, fetchWorkspaceUsers)
    // }
  
  // try {
  //   const session = await getUserSession(event)

  //   let users:IBrUser[] = []
  //   if(session.secure) {
  //     users = await fetchWorkspaceUsers(session.secure.access_token)
  //   }
  //   return users

  // } catch (error) {
  //   return error
  // }
})