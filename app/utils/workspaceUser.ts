import type { SelectItem } from "@nuxt/ui";

/**
 * Type for user for baserow
 */
export type WorkspaceUser = {
  name:string,
  id:number,
  email:string,
  user_id:string,
  permissions:string
}

export const getUsersSelectItems = (wsusers:WorkspaceUser[]) => {
  const users = ref<SelectItem[]>([])
  wsusers.forEach(user => {
    users.value.push({
      label: user.name,
      value: user.user_id
    })
  });
  return users
}
