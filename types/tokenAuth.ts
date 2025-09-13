/**
 * Type for Auth user
 */
export interface IUser {
  first_name:string
  username:string
  language:string
  user_id:number
}
/**
 * Type for Auth token
 */
export interface ITokenAuth {
  user:IUser
  token:string
  access_token:string
  refresh_token:string
}
