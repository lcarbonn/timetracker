export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn, user } = useUserSession()
  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    // useStatePause().value = undefined
    // useStateTrack().value = undefined
    return navigateTo('/login')
  }
})