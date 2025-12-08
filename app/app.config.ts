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
      base: 'relative grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8'
    }    
  }
})
