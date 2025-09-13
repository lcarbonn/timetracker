export default defineNuxtPlugin((nuxtApp) => {

    const baserowConfig:IBrConf = {
        url:import.meta.env.VITE_BASEROW_URL,
        baseName:import.meta.env.VITE_BASEROW_BASE_NAME,
        token:import.meta.env.VITE_BASEROW_TOKEN,
        baseId:import.meta.env.VITE_BASEROW_BASE_ID,
        tableTimeTrack:import.meta.env.VITE_BASEROW_TIMETRACK,
        workspaceId:import.meta.env.VITE_BASEROW_WORKSPACE,
    }

    nuxtApp.provide("baserowConfig", baserowConfig)
    nuxtApp.vueApp.provide("baserowConfig", baserowConfig)
})
