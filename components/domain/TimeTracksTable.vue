<template>
  <div>
    <BRow>
      <BCol lg="4" class="my-1">
        <span>Total Hours : <b>{{ formatDuration(totalHours) }}</b></span>
      </BCol>
      <BCol lg="4" class="my-1">
        <BPagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              size="sm"></BPagination>
      </BCol>
    </BRow>    

    <BTable
      striped
      hover
      stacked="md"
      empty-text="No track"
      show-empty
      :fields="(fields as TableField[])"
      :items="tracks"
      :current-page="currentPage"
      :per-page="perPage">
      <template #cell(id)="data">
        <BButton class="mx-1" @click="deleteTrack(data.item as ITimeTrack)" size="sm" ><Trash/></BButton>
      </template>
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <BSpinner class="align-middle" />
          <strong>Loading...</strong>
        </div>
      </template>
    </BTable>
  </div>
</template>

<script setup lang="ts">
import type { TableField } from 'bootstrap-vue-next';

  // icons
  import Trash from '~icons/bi/trash'

  import type { ITimeTrack } from '~/types/tableTimeTrack';

  // props
  const props = defineProps({
      tracks: {
          type: Array<ITimeTrack>,
          default: undefined
      }
  })

  // // emits declaration
  const emit = defineEmits(['deleteTrack', 'emitFilter'])

  // const fields
  const fields = [
      {
        key: 'Start',
        label: 'Start',
        sortable: true,
        formatter: (value: any, key: any, item: any) => {
          return getFormatedDate(value, item)
        },
      },
      {
        key: 'End',
        label: 'End',
        sortable: true,
        formatter: (value: any, key: any, item: any) => {
          return getFormatedDate(value, item)
        },
      },
      {
        key: 'Duration',
        label: 'Duration',
        formatter: (value: any, key: any, item: any) => {
          return formatDuration(value)
        },
      },
      {
        key: 'id',
        label: 'Actions'
        }
    ]

    // local ref
    const perPage = 10
    const currentPage =ref(1)
    const totalRows = ref()
    const totalHours = ref()
    
    // nuxt cycle hook
    watch(() => props.tracks, async(newTracks) => {
      if(newTracks) {
          totalRows.value = newTracks.length
          totalHours.value = sumTotalHours(newTracks)
        }
      }
    )

    /**
     * Get the date in locale
     * @param date - The date
     * @param item - The track
     */
    const getFormatedDate = (date:Date, item:any) : string => {
    let text = "not yet completed"
    if(date) {
      const start = new Date(date)
      text = start.toLocaleDateString() +" - "+start.toLocaleTimeString()
    } else {
      item._rowVariant =  "danger"
    }
    return text
    }
    
    const sumTotalHours = (tracks:ITimeTrack[]) : number => {
      let sum = 0
      tracks.forEach(track => {
        sum = sum + Number(track.Duration)
      });
      return sum
    }

    const deleteTrack = (track:ITimeTrack) => {
      emit('deleteTrack', track)
    }

    const emitFilter = () => {
      emit('emitFilter')
    }

</script>
