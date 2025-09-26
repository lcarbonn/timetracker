import { IBaserowAuth } from "~/utils/baserowAuth"

/**
 * Sign in user with email and password
 * @param email - the email
 * @param password - the password
 * @returns A Promise that resolve the auth user
 */
export const fetchSignInUser = async (email:string, password:string) :Promise<IBaserowAuth> => {
  const config = useRuntimeConfig()
  const url = config.baserowApiUrl
  const uri = `${url}/api/user/token-auth/`
  const tokenAuth = await $fetch<IBaserowAuth>(
      uri,
      {
        method:"POST",
        body: {
          email:email,
          password:password
        }
      }
  )
  return tokenAuth
}