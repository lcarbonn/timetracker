import type { ITokenAuth } from "~/types/tokenAuth"

/**
 * Sign in user with email and password
 * @param email - the email
 * @param password - the password
 * @returns A Promise that resolve the auth user
 */
export const signInUser = (email:string, password:string) :Promise<ITokenAuth> => {
    return new Promise((resolve, reject) => {
        fetchSignInUser(email,password)
        .then((authUser) => {
            messageToSnack("Hello " + authUser.user.first_name)
            authUser.user.user_id = getUserIdFromToken(authUser.token)
            useAuthUser().value = authUser
            resolve(authUser)
        })
        .catch((error) => {
            errorToSnack("Error on login", error)
            reject(error)
        })
    })
  }

/**
 * Sign out the current user
 */
export const signOutUser = () :Promise<void> => {
    return new Promise((resolve, reject) => {
        useAuthUser().value = undefined
        messageToSnack("SignOut")
        resolve()
    })
  }

  /**
   * 
   * @returns 
   */
export const getAuthUserId = (authUser:ITokenAuth) :Promise<ITokenAuth> => {
    return new Promise((resolve, reject) => {
        // const authUser = useAuthUser().value
        if(authUser) {
            fetchWorkspaceUsers(authUser.token)
            .then((users) => {
                users.forEach(user => {
                    if(user.email==authUser.user.username) authUser.user.user_id = user.user_id
                    resolve(authUser)
                });
            })
        }
        // useAuthUser().value = authUser
    })
  }
