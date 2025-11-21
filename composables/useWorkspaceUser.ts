
/**
 * Get workspace users
 * @returns Array of users
 */
export const getWorkspaceUsers = async () :Promise<IWorkspaceUser[]>=> {

  const result = $fetch<IWorkspaceUser[]>('/api/workspaceusers', {
    onResponseError ({ request, response, options }) {
      // Handle the response errors
      errorToSnack("Error in get users", response.statusText)
    },
  })
  return result
}
