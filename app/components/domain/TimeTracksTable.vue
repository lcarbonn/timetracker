<template>
  <div>
    <UPagination
      :page="pagination.pageIndex+1"
      :items-per-page="pagination.pageSize"
      :total="tracks.count"
      @update:page="(p) => paginate(p)"
    />
    <UTable
      sticky
      :data="tracks.results"
      :columns="columns"
      @hover=""
      v-model:pagination="pagination"
      >
    <template #action-cell="{ row }">
      <UDropdownMenu :items="getTrackActions(row.original)">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          aria-label="Actions"
        />
      </UDropdownMenu>
    </template>
  </UTable>      
  </div>
</template>
<script setup lang="ts">
  import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
  import type { Row } from '@tanstack/vue-table'
  
  // props
  const props = defineProps<{
      tracks: IBaserowListResponse
      pageSize: number,
      pageIndex:number
    }>()

  // emits declaration
  const emit = defineEmits<{
    paginate: [page: number]
  }>()

  const pagination = ref({
    pageIndex: props.pageIndex,
    pageSize: props.pageSize
  })

  const paginate = async (p:number) => {
      emit('paginate', p)
      // tracks.value = await getTimeTracks(pageSize, p)
      pagination.value.pageIndex = (p-1)
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