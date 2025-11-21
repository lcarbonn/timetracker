import { IWorkspaceUser } from "~/utils/workspaceUser";
import { rawFetch } from "./baserrowFetch";
import { IPermissions } from "~/utils/worspacePermission";

/**
 * Get the workspace permissions for the connected user
 * @returns Promise - the array of permissions
 */
export const fetchWorkspacePermisssions = async (token:string) : Promise<IPermissions[]> => {
    const config = useRuntimeConfig()
    const WORKSPACE_ID = config.public.workspaceId

    const endpoint = `/api/workspaces/${WORKSPACE_ID}/permissions/`

    // Use fetch with the runtime config values
    const permissions = await rawFetch<IPermissions[]>(
      endpoint,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    )
    return permissions
}

/**
 * Get the workspace users list
 * @returns Promise - the array of users
 */
export const fetchWorkspaceUsers = async () : Promise<IWorkspaceUser[]> => {
    const config = useRuntimeConfig()
    const WORKSPACE_ID = config.public.workspaceId

    const endpoint = `/api/workspaces/users/workspace/${WORKSPACE_ID}/`
    return await rawFetch<IWorkspaceUser[]>(endpoint)
}
