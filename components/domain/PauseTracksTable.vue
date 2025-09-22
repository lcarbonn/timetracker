<template>
  <div>
    <BRow>
      <BCol lg="4" class="my-1">
      </BCol>
      <BCol lg="4" class="my-1">
        <span>Total Hours : <b>{{ totalHours }}</b></span>
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
      :fields="(fields as TableField[])"
      :items="pauses"
      :current-page="currentPage"
      :per-page="perPage">
      <template #cell(id)="data" v-if="!disabled">
        <BButton class="mx-1" @click="deletePause(data.item as IPauseTrack)" size="sm" ><Trash/></BButton>
        <BButton v-if="data.index==0 && data.item.End!=null" class="mx-1" @click="reopenPause(data.item as IPauseTrack)" size="sm" >Restart</BButton>
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
  import type { IPauseTrack } from '~/types/tablePauseTrack';

  // props
  const props = defineProps({
      pauses: {
          type: Array<IPauseTrack>,
          default: undefined
      },
      disabled: {
        type:Boolean,
        default:false
      }
  })

  // // emits declaration
  const emit = defineEmits(['deletePause', 'reopenPause'])

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
    watch(() => props.pauses, async(newTracks) => {
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
    
    const sumTotalHours = (tracks:IPauseTrack[]) : string => {
      let sum = 0
      tracks.forEach(track => {
        sum = sum + Number(track.Duration)
      });
      return sum.toLocaleString()
    }

    const deletePause = (track:IPauseTrack) => {
      emit('deletePause', track)
    }

    const reopenPause = (track:IPauseTrack) => {
      emit('reopenPause', track)
    }

</script>
