export default defineAppConfig({
  ui: {
    main: {
      base: 'min-h-[calc(90vh-var(--ui-header-height))]'
    },
    colors: {
      primary: 'brand',
      secondary: 'brand-sec',
      info: 'brand-info'
    },
    pageGrid: {
      base: 'relative grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4'
    },
    footer: {
      slots: {
        container: 'py-0 lg:py-2 lg:flex lg:items-center lg:justify-between lg:gap-x-3',
      }
    },
    table: {
      slots: {
        tr: 'even:bg-primary-50 dark:even:bg-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-700/50'
      }
    },
  }
})
