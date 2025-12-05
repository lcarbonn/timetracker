<template>
    <div>
      <UPageCard title="Tables"></UPageCard>
      <UPageGrid>
        <UFormField label="User">
          <USelect v-model="filterUser" value-key="id" :items="users" placeholder="Select a user" class="w-48"/>
          <!-- <UInput v-model="filterUser" placeholder="choose a user"/> -->
        </UFormField>
        <UFormField label="Year">
          <USelect v-model="filterYear" :items="years" placeholder="Select a year" class="w-48"/>
        </UFormField>
        <UFormField label="Filters">
          <UButton @click="resetAllFilter">Reset filters</UButton>
        </UFormField>
      </UPageGrid>
      <DomainTimeTracksTable 
        v-if="tracks"
        :tracks="tracks"
        :pageSize="pageSize"
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

  const pageSize = 10
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

  const prepEmit= (newValue:any, filterName:string) => {
    if(!filter.value) filter.value = {}
    switch (filterName) {
      case "user":
        filter.value.user = newValue? newValue:undefined
        break;
      case "year":
        filter.value.year = newValue? newValue:undefined
        break;
      default:
        break;
    }
    filterTracks()
  }
  // emit the filter query
  const filterTracks = async () => {
    const data = await getAllTimeTracks(pageSize, 1, filter.value)
    tracks.value = data
  }

  // reset the filters
  const resetAllFilter = () => {
    filterUser.value = null
    filterYear.value = null
  }


</script>