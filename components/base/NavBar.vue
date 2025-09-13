<template>
  <client-only>
  <BNavbar :toggleable="true" variant="primary" sticky='top' v-b-color-mode="'dark'">
    <BNavbarToggle target="nav-collapse" />
    <BNavbarBrand to="/">
        <BAvatar rounded src="/icon.png"></BAvatar>
    </BNavbarBrand>
    <BNavbarNav fill>
      <BNavItem :href="'https://baserow.io/database/' + baseId +'/table/' + tableId" target="_blank"><BAvatar rounded src="/baserow-logo.png"></BAvatar></BNavItem>
    </BNavbarNav>
    <BOffcanvas id="nav-collapse"
        isNav
        v-model="show"
        placement="start"
        title="Noco Lowco Time Tracker"
        style="background-color:var(--bs-primary);color:var(--bs-white)"
       >
      <BNavbarNav class="ms-auto mb-2 mb-lg-0">
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

  // icons
  import Person from '~icons/bi/person'
  
  //local ref
  const show = ref(false)
  // global states
  const authUser = useAuthUser()

  // computed properties
  const isConnected = computed(() => {
    return !!authUser.value?.user
  })
  const userEmail = computed(() => {
    return authUser.value?.user.username
  })
  const baseId = computed(() => {
    return import.meta.env.VITE_BASEROW_BASE_ID
  })
  const baseName = computed(() => {
    return import.meta.env.VITE_BASEROW_BASE_NAME
  })
  const tableId = computed(() => {
    return import.meta.env.VITE_BASEROW_TIMETRACK
  })

  //   // methods
  // const resetFilter = () => {
  //   resetStatedFilter()
  // }

  // methods
  const signOut = async () => {
    show.value = false
    signOutUser()
    await navigateTo('/')
  }

</script>

<style scoped>
.nodecoLink {
  text-decoration: none !important;
}
</style>
