<template>
    <UTable 
      :data="users" 
      sticky 
      :columns="columns"
      @hover=""
      />
</template>

<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';

  // props
  const props = defineProps<{
      users: Array<WorkspaceUser>
    }>()

  const columns: TableColumn<WorkspaceUser>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
    },
    {
      accessorKey: 'user_id',
      header: 'User ID',
    },
  ]
</script>
