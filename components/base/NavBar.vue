<template>
  <client-only>
  <BNavbar :toggleable="true" variant="primary" sticky='top' v-b-color-mode="'dark'">
    <BNavbarToggle target="nav-collapse" />
    <BNavbarBrand to="/">
        <BAvatar rounded src="/icon.png"></BAvatar>
    </BNavbarBrand>
    <BNavbarNav fill>
      <BNavItem :href="baseUrl + baseId +'/table/' + tableId" target="_blank"><BAvatar rounded src="/baserow-logo.png"></BAvatar></BNavItem>
    </BNavbarNav>
    <BOffcanvas id="nav-collapse"
        isNav
        v-model="show"
        placement="start"
        title="NocoLowco Time Tracker"
        style="background-color:var(--bs-primary);color:var(--bs-white)"
       >
      <BNavbarNav class="ms-auto mb-2 mb-lg-0">
        <BNavItem  v-if="isConnected" href="/weeks">My week calendar</BNavItem>
        <BNavItem  v-if="isConnected" @click="exportCsv">Export week tracks</BNavItem>
        <BNavItem  v-if="isConnected && isAdmin" href="/users">All users</BNavItem>
        <BNavItemDropdown v-if="isConnected" right>
          <template #button-content>
            <em>{{userEmail}}<Person/></em>
          </template>
          <BDropdownItem  @click="signOut()">Sign Out</BDropdownItem>
        </BNavItemDropdown>
        <BaseThemeItemDropdown @clicked="show=!show"/>
      </BNavbarNav>
    </BOffcanvas>
  </BNavbar>
  </client-only>
</template>

<script setup lang="ts">

  // get user session
  const { loggedIn, user, clear: clearSession } = useUserSession()
  const config = useRuntimeConfig()

  // icons
  import Person from '~icons/bi/person'
  
  //local ref
  const show = ref(false)

  // computed properties
  const isConnected = computed(() => {
    return loggedIn.value
  })
  const isAdmin = computed(() => {
   return user.value?.isAdmin
  })
  const userEmail = computed(() => {
    return user.value?.username
  })
  const baseUrl = computed(() => {
    return config.public.baseUrl
  })
  const baseId = computed(() => {
    return config.public.baseId
  })
  const tableId = computed(() => {
    return config.public.tableTimetrackId
  })

  // methods
  const signOut = async () => {
    show.value = false
    // signOutUser()
    useStatePause().value = undefined
    useStateTrack().value = undefined
    await clearSession()
    await navigateTo('/login')
  }

  // methods
  const exportCsv = async () => {
    const uid = user.value?.id
    if(!uid) return
    const tracks = await getTracksForExport(uid)
    exportCSVFile(tracks)
  }

</script>

<style scoped>
.nodecoLink {
  text-decoration: none !important;
}
</style>
