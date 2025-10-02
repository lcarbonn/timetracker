/**
 * get workspace users
 */
export const getWorkspaceUsers = async () :Promise<IBrUser[]>=> {
  console.log("getWorkspaceUsers")
  return $fetch<IBrUser[]>('/api/workspaceusers', {
    onResponse ({ request, response, options }) {
      // console.log("getWorkspaceUsers response")
    },
    onResponseError ({ request, response, options }) {
      // Handle the response errors
      errorToSnack("Error in get users", response.statusText)
    },
  })
}
