<template>
    <div>
      <UPageCard title="Users"></UPageCard>
      <DomainUsersTable v-if="users" :users="users"></DomainUsersTable>
    </div>
</template>

<script setup lang="ts">

  // middleware
  definePageMeta({
    middleware: 'admin'
  })

  // init on setup
  const { data:users } = await useAsyncData('fetchUsers', () => getWorkspaceUsers())

</script>