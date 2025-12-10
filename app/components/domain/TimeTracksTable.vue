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
      <!-- <UDropdownMenu :items="getTrackActions(row.original)">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          aria-label="Actions"
        />
      </UDropdownMenu> -->
    </template>
  </UTable>      
  </div>
</template>
<script setup lang="ts">
  import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
  
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
      // tracks.value = await getTimeTracks(pageSize, p)
      localPagination.value.pageIndex = (p-1)
  }

  const columns: TableColumn<ITimeTrack>[] = [
    {
      accessorKey: 'UID',
      header: 'User',
      cell: ({ row }) => {
        const UID = row.getValue('UID') as IUID[]
        return UID[0]?.name
      }
    },
    {
      accessorKey: 'Start',
      header: 'Start',
      cell: ({ row }) => {
        if(!row.getValue('Start')) return
        const date = new Date(row.getValue('Start'))
        return date.toLocaleDateString() +" - "+date.toLocaleTimeString()
      }
    },
    {
      accessorKey: 'End',
      header: 'End',
      cell: ({ row }) => {
        if(!row.getValue('End')) return
        const date = new Date(row.getValue('End'))
        return date.toLocaleDateString() +" - "+date.toLocaleTimeString()
      }
    },
    {
      accessorKey: 'Duration',
      header: 'Duration',
      cell: ({ row }) => {
        return formatDuration(row.getValue('Duration'))
      }
    },
    {
      id: 'action'
    }
  ]

  function getTrackActions(track:ITimeTrack): DropdownMenuItem[][] {
    return [[
      {
        type: 'label',
        label: 'Actions'
      },
      {
        label: 'Copy payment ID',
        icon: "streamline-color:blank-calendar-flat",
        onSelect() {
          messageToSnack("selected track: "+track.id)
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'View customer'
      },
      {
        label: 'View payment details'
      }
    ]]
}
</script>