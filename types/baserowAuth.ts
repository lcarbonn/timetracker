/**
 * Type for Auth user
 */
export interface IUser {
  first_name:string
  username:string
  language:string
  id:number
}
/**
 * Type for Auth token
 */
export interface IBaserowAuth {
  user:IUser
  token:string
  access_token:string
  refresh_token:string
}
