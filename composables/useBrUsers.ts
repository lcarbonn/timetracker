/**
 * get workspace users
 */
export const getWorkspaceUsers = () :Promise<IBrUser[]>=> {
  console.log("getWorkspaceUsers")
  return $fetch<IBrUser[]>('/api/workspaceusers', {
    onResponseError ({ request, response, options }) {
      // Handle the response errors
      errorToSnack("Error in get users", response.statusText)
    },
  })
}
