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
      // cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
      accessorKey: 'email',
      header: 'Email',
      // cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      // cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
      accessorKey: 'user_id',
      header: 'User ID',
      // cell: ({ row }) => `#${row.getValue('id')}`
    },
  ]
</script>
