<template>
  <UHeader title="Time Tracker" mode="slideover" toggle-side="left">
    <template #title>
      <UAvatar 
        class="rounded-lg"
        src="/icon.png"/> Time Tracker
    </template>
    <UNavigationMenu :items="items"/>
    <template #right>
      <UColorModeButton />
      <NuxtLink
        :to="baseUrl + baseId +'/table/' + tableId"
        target="_blank">
        <UTooltip text="Open on Baserow">
          <UAvatar 
            class="rounded-lg"
            src="/baserow-logo.png"/>
        </UTooltip>
        </NuxtLink>
    </template>
    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>    
  </UHeader>
</template>
<script setup lang="ts">

import type { NavigationMenuItem } from '@nuxt/ui'

  // get env variables from config
  const config = useRuntimeConfig()
  const baseUrl = computed(() => {
    return config.public.baseUrl
  })
  const baseId = computed(() => {
    return config.public.baseId
  })
  const tableId = computed(() => {
    return config.public.tableTimetrackId
  })

    // get user session
  const { loggedIn, user, clear: clearSession } = useUserSession()

  const userEmail = computed(() => {
    return user.value?.username
  })

  const items = computed<NavigationMenuItem[]>(() => {
    const items:NavigationMenuItem[] = []
    if (!loggedIn.value) return []
    else {
      items.push(
        {
          label: userEmail.value,
          icon:"streamline-color:user-circle-single-flat",
          children: [
            {
            label: 'Sign Out',
            icon: 'streamline-color:logout-1-flat',
            onSelect: () => {
              signOut()
            },
          }]
        },
        {
          label: "Week",
          icon: "streamline-color:blank-calendar-flat",
          to: '/weeks'
        },
        {
          label: "Export",
          icon: "streamline-color:arrow-down-2-flat",
          onSelect: () => {
            exportCsv()
          }
        },
      )
      if(user.value?.isAdmin) {
        items.push(
          {
            label: "Users",
            icon: "streamline-color:user-multiple-group-flat",
            to: '/users'
          },
        )
      }
    }
    return items
  })

  const signOut = async () => {
    useStatePause().value = undefined
    useStateTrack().value = undefined
    await clearSession()
    await navigateTo('/login')
    messageToSnack("Signed out")
  }

  // methods
  const exportCsv = async () => {
    const uid = user.value?.id
    if(!uid) return
    const tracks = await getTracksForExport(uid)
    exportCSVFile(tracks)
  }

</script>