<template>
  <div>
    <UPagination
      :page="localPagination.pageIndex+1"
      :items-per-page="localPagination.pageSize"
      :total="tracks.count"
      @update:page="(p) => paginate(p)"
    />
    <UTable
      sticky
      :data="tracks.results"
      :columns="columns"
      @hover=""
      v-model:pagination="localPagination"
      >
    <template #action-cell="{ row }">
      <UButton icon="streamline-color:pencil-flat" @click="messageToSnack('Open '+row.original.id)" class="mr-1"></UButton>
      <UButton icon="streamline-color:recycle-bin-2-flat" @click="messageToSnack('Delete '+row.original.id)" class="mr-1"></UButton>
      <UButton icon="streamline-color:copy-paste-flat" @click="messageToSnack('Copy '+row.original.id)"></UButton>
    </template>
  </UTable>      
  </div>
</template>
<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';
  
  // props
  const props = defineProps<{
      tracks: IBaserowListResponse;
      pagination: Pagination;
    }>()

  // emits declaration
  const emit = defineEmits<{
    paginate: [page: number]
  }>()


  const localPagination = ref({
    pageIndex: props.pagination.pageIndex,
    pageSize: props.pagination.pageSize
  })

  watch(props.pagination, (newValue, oldValue) => {
    localPagination.value.pageIndex = newValue.pageIndex,
    localPagination.value.pageSize = newValue.pageSize
  })

  const paginate = async (p:number) => {
      emit('paginate', p-1)
      localPagination.value.pageIndex = (p-1)
  }

  const columns: TableColumn<ITimeTrack>[] = [
    {
      accessorKey: 'UID',
      header: 'User',
      cell: ({ row }) => {
        const UID = row.original.UID
        return UID[0]?.name
      }
    },
    {
      accessorKey: 'Start',
      header: 'Start',
      cell: ({ row }) => {
        if(!row.original.Start) return
        const date = new Date(row.original.Start)
        return date.toLocaleDateString() +" - "+date.toLocaleTimeString()
      }
    },
    {
      accessorKey: 'End',
      header: 'End',
      cell: ({ row }) => {
        if(!row.original.End) return
        const date = new Date(row.original.End)
        return date.toLocaleDateString() +" - "+date.toLocaleTimeString()
      }
    },
    {
      accessorKey: 'Duration',
      header: 'Duration',
      cell: ({ row }) => {
        return formatDuration(row.original.Duration)
      }
    },
    {
      id: 'action'
    }
  ]
  
</script>