import { IBrUser } from "~/utils/bruser";
import { IPermissions } from "~/utils/permission";
import { rawFetch } from "./baserrowFetch";

const config = useRuntimeConfig()

const URL = config.baserowApiUrl
const WORKSPACE_ID = config.public.workspaceId

/**
 * Get the workspace permissions for the connected user
 * @returns Promise - the array of permissions
 */
export const fetchWorkspacePermisssions = async (token:string) : Promise<IPermissions[]> => {
    const uri = `${URL}/api/workspaces/${WORKSPACE_ID}/permissions/`

    // Use fetch with the runtime config values
    const response = await fetch(
      uri,
      {
        headers: {
          Authorization: `JWT ${token}`,
          // Authorization: `Token ${TOKEN}`
        },
      }
    )
    if(response.ok) {
      const data = await response.json() as Promise<IPermissions[]>
      return data
    }
    else {
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
      })
    }
}

/**
 * Get the workspace users list
 * @returns Promise - the array of users
 */
export const fetchWorkspaceUsers = async () : Promise<IBrUser[]> => {
    const endpoint = `/api/workspaces/users/workspace/${WORKSPACE_ID}/`
    return await rawFetch<IBrUser[]>(endpoint)
}
