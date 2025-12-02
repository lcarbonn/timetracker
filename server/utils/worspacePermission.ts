
/**
 * Type for Permission
 */
export interface IPermission {
  is_admin?:boolean
}
/**
 * Type for Permissions
 */
export interface IPermissions {
  name:string,
  permissions:IPermission
}
