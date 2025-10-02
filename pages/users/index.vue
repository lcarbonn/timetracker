<template>
    <div>
      <!-- <pre>{{ users }}</pre> -->
      <BCard :title="'Users '" body-class="text-center">
      </BCard>
      <DomainUsersTable v-if="users" :users="users"></DomainUsersTable>
    </div>
</template>

<script setup lang="ts">

  // middleware
  definePageMeta({
    middleware: 'admin'
  })

  // init on setup
  const { data:users} = await useAsyncData('fetchUsers', () => getWorkspaceUsers())

</script>