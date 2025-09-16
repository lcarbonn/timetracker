/**
 * Sign in user with email and password
 * @param email - the email
 * @param password - the password
 * @returns A Promise that resolve when completed
 */
export const signInUser = (email:string, password:string) :Promise<void> => {
    return new Promise((resolve, reject) => {
        const { fetch: refreshSession } = useUserSession()
        $fetch('/api/login', {
            method: 'POST',
            body: {
                email:email,
                password:password
            }
        })
        .then(async (data) => {
            // Refresh the session on client-side and redirect to the home page
            messageToSnack("Hello " + data)
            await refreshSession()
            await navigateTo('/')
            resolve()
        })
        .catch((error) => {
            errorToSnack("Error on login", error)
            reject(error)
        })
    })
  }
