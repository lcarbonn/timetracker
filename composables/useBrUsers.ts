/**
 * get workspace users
 */
export const getWorkspaceUsers = async () :Promise<IBrUser[]>=> {
  let users:IBrUser[] = []
  await useFetch('/api/workspaceusers', {
    onResponse ({ request, response, options }) {
      // Process the response data
      if(response._data) users = response._data
    },
    onResponseError ({ request, response, options }) {
      // Handle the response errors
      errorToSnack("Error in get users", response.statusText)
    },
  })
  return users
}
