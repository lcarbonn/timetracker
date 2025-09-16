import type { IBaserowAuth } from "~/types/baserowAuth";

/**
 * Sign in user with email and password
 * @param email - the email
 * @param password - the password
 * @returns A Promise that resolve the auth user
 */
export const fetchSignInUser = async (email:string, password:string) :Promise<IBaserowAuth> => {
    const url = import.meta.env.VITE_BASEROW_URL
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