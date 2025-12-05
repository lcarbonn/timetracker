<template>
    <div>
      <UPageCard title="Users"></UPageCard>
      <DomainUsersTable v-if="users" :users="users" class="mt-4"></DomainUsersTable>
    </div>
</template>

<script setup lang="ts">

  // middleware
  definePageMeta({
    middleware: 'admin'
  })

  // init on setup
  const users = await getWorkspaceUsers()

</script>