<template>
  <div>
    <BRow>
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
      :busy="isBusy"
      empty-text="No User"
      show-empty
      :fields="(fields as TableField[])"
      :items="users"
      :current-page="currentPage"
      :per-page="perPage">
      <!-- <template #cell(id)="data">
        <BButton class="mx-1" @click="deleteTrack(data.item as ITimeTrack)" size="sm" ><Trash/></BButton>
      </template> -->
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

  // props
  const props = defineProps({
      users: {
          type: Array<IBrUser>,
          default: undefined
      }
  })

  // // emits declaration
  const emit = defineEmits(['deleteTrack'])

  // const fields
  const fields = [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
      },
      {
        key: 'permissions',
        label: 'Permissions',
        sortable: true,
      },
      {
        key: 'user_id',
        label: 'User Id'
        }
    ]

    // local ref
    const perPage = 10
    const currentPage =ref(1)
    const totalRows = ref()
    const isBusy = ref(true)
    
    // // nuxt cycle hook
    watch(() => props.users, async(users) => {
      if(users) {
          totalRows.value = users.length
        }
      isBusy.value = false
      }
    )
    // const deleteTrack = (track:ITimeTrack) => {
    //   emit('deleteTrack', track)
    // }
</script>
