<template>
    <div>
      <UPageCard title="Tables"></UPageCard>
      <UPageGrid>
        <UFormField label="User">
          <USelect v-model="filterUser" value-key="id" :items="users" placeholder="Select a user" class="w-48"/>
        </UFormField>
        <UFormField label="Year">
          <USelect v-model="filterYear" :items="years" placeholder="Select a year" class="w-48"/>
        </UFormField>
        <UFormField label="Month">
          <USelect v-model="filterMonth" :items="months" placeholder="Select a month" class="w-48"/>
        </UFormField>
        <UFormField label="Filters">
          <UButton @click="resetAllFilter">Reset filters</UButton>
        </UFormField>
      </UPageGrid>
      <DomainTimeTracksTable 
        v-if="tracks"
        :tracks="tracks"
        :pageSize="pageSize"
        :pageIndex="pageIndex"
        @paginate="paginate"
        class="mt-4"/>
    </div>
</template>

<script setup lang="ts">

  import type { SelectItem } from '@nuxt/ui'

  // middleware
  definePageMeta({
    middleware: 'admin'
  })

  const tracks = ref()
  const filter = ref<Filter>()
  const filterUser = ref()
  const filterYear = ref()
  const filterMonth = ref()

  const pageSize = 10
  const pageIndex = ref(0)
  // init on setup
  const data = await getAllTimeTracks(pageSize)
  tracks.value = data
  const wsusers = await getWorkspaceUsers()
  const users = ref<SelectItem[]>([])
  wsusers.forEach(user => {
    users.value.push({
      label: user.name,
      id: user.user_id
    })
    
  });

  const years = ref(['2025', '2024'])
  const months = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])

  const paginate = async (page:number) => {
    const data = await getAllTimeTracks(pageSize, page, filter.value)
    tracks.value = data
  }

  // watch local refs udpates
  watch(filterUser, (newValue) => {
    prepEmit(newValue, "user")
  })
  watch(filterYear, (newValue) => {
    prepEmit(newValue, "year")
  })
  watch(filterMonth, (newValue) => {
    prepEmit(newValue, "month")
  })

  const prepEmit= (newValue:any, filterName:string) => {
    if(!filter.value) filter.value = {}
    switch (filterName) {
      case "user":
        filter.value.user = newValue? newValue:undefined
        break;
      case "year":
        filter.value.year = newValue? newValue:undefined
        break;
      case "month":
        filter.value.month = newValue? newValue:undefined
        break;
      default:
        break;
    }
    filterTracks()
  }
  // emit the filter query
  const filterTracks = async () => {
    const data = await getAllTimeTracks(pageSize, 1, filter.value)
    pageIndex.value = 0
    tracks.value = data
  }

  // reset the filters
  const resetAllFilter = () => {
    filterUser.value = null
    filterYear.value = null
    filterMonth.value = null
    pageIndex.value = 0
  }


</script>