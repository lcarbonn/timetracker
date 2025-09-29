import { IPermission, IPermissions } from "~/utils/permission";
import type { ListTimeResponse, ITimeTrack } from "~/utils/tableTimeTrack";

const config = useRuntimeConfig()

const URL = config.baserowApiUrl
const WORKSPACE_ID = config.public.workspaceId

/**
 * Get the workspace permissions for the connected user
 * @returns Promise - the array of permissions
 */
export const fetchWorkspacePermisssions = (token:string) : Promise<IPermissions[]> => {
  return new Promise((resolve, reject) => {
    const uri = `${URL}/api/workspaces/${WORKSPACE_ID}/permissions/`
    // Use fetch with the runtime config values
    $fetch<IPermissions[]>(
      uri,
      {
        headers: {
          Authorization: `JWT ${token}`,
          // Authorization: `Token ${TOKEN}`
        },
      }
    ).then((res) => {
        resolve(res)
    })
  })
}
