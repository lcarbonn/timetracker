
/**
 * Get workspace users
 * @returns Array of users
 */
export async function getWorkspaceUsers(): Promise<IWorkspaceUser[]> {
  // can only be called on server side due to JWT token
  const  { data } = await useFetch('/api/workspaceusers', {
    onResponseError({ request, response, options }) {
      // Handle the response errors
      // console.log("Error in get users", response.statusText)
      errorToSnack("Error in get users", response.statusText)
    },
  })
  return data.value as IWorkspaceUser[]
}
