<template>
    <div>
      <BCard :title="'Users '" body-class="text-center">
      </BCard>
      <DomainUsersTable :users="users"></DomainUsersTable>
    </div>
</template>

<script setup lang="ts">

  // middleware
  definePageMeta({
    middleware: 'admin'
  })

  const { user } = useUserSession()

    // local refs
  const users = useWorkspaceUsers()

  // init on setup
  getStateWorkspaceUsers()


</script>