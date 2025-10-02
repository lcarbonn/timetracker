import type { Reactive } from "vue"

/**
 * get workspace users
 */
export const getStateWorkspaceUsers = async () :Promise<IBrUser[]>=> {
  let users:IBrUser[] = []
  await useFetch('/api/workspaceusers', {
    onRequest ({ request, options }) {
      // Set the request headers
      // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
      // options.headers.set('Authorization', '...')
    },
    onRequestError ({ request, options, error }) {
      // Handle the request errors
    },
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
