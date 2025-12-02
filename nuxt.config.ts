// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app:{
    head: {
      title: 'NocoLowco Time Tracker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'NocoLowco Time Tracker' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', type: 'image/x-icon', href: '/apple-touch-icon-180x180.png' }
      ]
    },
  },

  modules: [
    '@nuxt/ui',
    '@vite-pwa/nuxt',
    "nuxt-auth-utils"],

  css: ['~/assets/css/main.css'],

  build: {
    transpile: [
      '/@fullcalendar.*/'
    ]
  },

  pwa: {
    /* PWA options */
    registerType: 'autoUpdate',
    manifest: {
      name: 'Time Tracker',
      short_name: 'Time Tracker',
      display: 'standalone',
      description: 'NocoLowco Time Tracker',
      lang: 'fr-FR',
      theme_color: '#17a2b8',
      icons: [
          {
            "src": "pwa-64x64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "maskable-icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ]      
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: "module"
    }    
  },
  runtimeConfig: {
    public: {
      baseApiUrl:'',
      baseUrl:'',
      baseId:'',
      baseName:'',
      tableTimetrackId:'',
      tablePausetrackId:'',
      workspaceId:'',
      token:''
    }
  }  
})