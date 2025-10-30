/**
 * Sign in user with email and password
 * @param email - the email
 * @param password - the password
 * @returns A Promise that resolve when completed
 */
export const signInUser = async (email:string, password:string) :Promise<void> => {
    const { fetch: refreshSession, clear } = useUserSession()
    const result = await $fetch('/api/login', {
        method: 'POST',
        body: {
            email:email,
            password:password
        },
        onResponseError({response}) {
            clear()
            errorToSnack("Error on login", response.statusText)
            throw createError({
                statusCode: response.status,
                statusMessage: response.statusText,
            })
        }
    })
    // Refresh the session on client-side and redirect to the home page
    messageToSnack("Hello " + result)
    await refreshSession()
    await navigateTo('/')
    return
  }
