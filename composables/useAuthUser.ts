/**
 * Sign in user with email and password
 * @param email - the email
 * @param password - the password
 * @returns A Promise that resolve when completed
 */
export const signInUser = async (email:string, password:string) :Promise<void> => {
        const { fetch: refreshSession } = useUserSession()
        $fetch('/api/login', {
            method: 'POST',
            body: {
                email:email,
                password:password
            }
        })
        .then(async (first_name) => {
            // Refresh the session on client-side and redirect to the home page
            messageToSnack("Hello " + first_name)
            await refreshSession()
            await navigateTo('/')
            return
        })
        .catch((error) => {
            errorToSnack("Error on login", error)
            throw(error)
        })
  }
