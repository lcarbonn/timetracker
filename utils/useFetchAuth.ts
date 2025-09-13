import type { ITokenAuth } from "~/types/tokenAuth";

/**
 * Sign in user with email and password
 * @param email - the email
 * @param password - the password
 * @returns A Promise that resolve the auth user
 */
export const fetchSignInUser = (email:string, password:string) :Promise<ITokenAuth> => {
  return new Promise((resolve, reject) => {
    const { $baserowConfig } = useNuxtApp()
    const config = $baserowConfig as IBrConf
    let uri = `${config.url}/api/user/token-auth/`
    // Use fetch with the runtime config values
    useFetch<ITokenAuth>(
      uri,
      {
        method:"POST",
        body: {
          email:email,
          password:password
        }
      }
    ).then(({data, error}) => {
      if(data.value)
        resolve(data.value)
      if(error.value)
        reject(error)
    }
    )
  })
}