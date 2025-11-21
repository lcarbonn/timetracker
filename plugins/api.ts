export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const BASEROW_URL = config.public.baseApiUrl
  const TOKEN = config.public.token

  const api = $fetch.create({
    baseURL: BASEROW_URL,
    onRequest ({ request, options, error }) {
      options.headers.set("Content-Type", "application/json");
      if(TOKEN) {
            options.headers.set("Authorization", `Token ${TOKEN}`);
      }
      // console.log("token:", TOKEN)
    },
    onResponse ({ request, response, options }) {
      // console.log("response data:", response._data)
    },
    async onResponseError ({ response }) {
      // console.log("error", response.status, ":", response.status)
      if (response.status != 200) {
        errorToSnack("Erreur accés baserow", response.status)
      }
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api: api,
    },
  }
})
