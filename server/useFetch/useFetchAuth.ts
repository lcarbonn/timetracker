import { IBaserowAuth } from "../utils/baserowAuth"
import { rawFetch } from "./baserrowFetch"

/**
 * Sign in user with email and password
 * @param email - the email
 * @param password - the password
 * @returns A Promise that resolve the auth user
 */
export const fetchSignInUser = async (email:string, password:string) :Promise<IBaserowAuth> => {
    const endpoint = `/api/user/token-auth/`
    const tokenAuth = await rawFetch<IBaserowAuth>(endpoint,
      {
        method:"POST",
        body: {
          email:email,
          password:password
        }
      },
    )
    return tokenAuth
}