/**
 * Type for Auth user
 */
export interface IUser {
  first_name:string
  username:string
  language:string
  id:number
  isAdmin:boolean
}
/**
 * Type for Auth token
 */
export interface IBaserowAuth {
  user:IUser
  access_token:string
  refresh_token:string
}
