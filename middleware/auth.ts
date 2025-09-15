export default defineNuxtRouteMiddleware((to, from) => {
  if (!useAuthUser().value) {
    return navigateTo('/login')
  }
})