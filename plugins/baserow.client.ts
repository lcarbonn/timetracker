import type { IBrConf } from "~/types/baserow"

export default defineNuxtPlugin((nuxtApp) => {

    const baserowConfig:IBrConf = {
        url:import.meta.env.VITE_BASEROW_URL,
        baseName:import.meta.env.VITE_BASEROW_BASE_NAME,
        baseId:import.meta.env.VITE_BASEROW_BASE_ID,
        tableTimeTrack:import.meta.env.VITE_BASEROW_TIMETRACK,
    }

    nuxtApp.provide("baserowConfig", baserowConfig)
    nuxtApp.vueApp.provide("baserowConfig", baserowConfig)
})
