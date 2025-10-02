
/**
 * Get workspace users
 * @returns Array of users
 */
export const getWorkspaceUsers = () :Promise<IBrUser[]>=> {
  const result = $fetch<IBrUser[]>('/api/workspaceusers', {
    onResponseError ({ request, response, options }) {
      // Handle the response errors
      errorToSnack("Error in get users", response.statusText)
    },
  })
  return result
}
