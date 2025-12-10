<template>
    <div>
      <UPageCard title="Tables"></UPageCard>
      <DomainFilterTable :users="users" @filter="filterTracks"/>
      <!-- <UPageGrid>
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
      </UPageGrid> -->
      <DomainTimeTracksTable
        v-if="tracks"
        :tracks="tracks"
        :pagination="pagination"
        @paginate="paginate"
        class="mt-4"/>
    </div>
</template>

<script setup lang="ts">

  // middleware
  definePageMeta({
    middleware: 'admin'
  })

  const tracks = ref()
  const filter = ref<Filter>()
  const pagination = ref<Pagination>({
    pageIndex : 0,
    pageSize : 10
  })

  // init on setup
  const data = await getAllTimeTracks(pagination.value)
  tracks.value = data
  const wsusers = await getWorkspaceUsers()
  const users = getUsersSelectItems(wsusers)

  const paginate = async (pageIndex:number) => {
    pagination.value.pageIndex = pageIndex
    const data = await getAllTimeTracks(pagination.value, filter.value)
    tracks.value = data
  }

  // emit the filter query
  const filterTracks = async (newFilter:Filter) => {
    filter.value = newFilter
    pagination.value.pageIndex = 0
    const data = await getAllTimeTracks(pagination.value, filter.value)
    tracks.value = data
  }

</script>