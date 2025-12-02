export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn, user } = useUserSession()
  // redirect the user to the login screen if they're not authenticated and admin
  if (!(loggedIn.value && user.value?.isAdmin)) {
    return navigateTo('/login')
  }
})