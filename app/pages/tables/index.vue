<template>
    <div>
      <UPageCard title="Tables"></UPageCard>
      <DomainFilterTable
        v-if="tracks"
        :users="users"
        @filter="filterTracks"
        class="mt-1"/>
      <DomainTimeTracksTable
        v-if="tracks"
        :tracks="tracks"
        :pagination="pagination"
        @paginate="paginate"
        class="mt-1"/>
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
  tracks.value = await getAllTimeTracks(pagination.value)
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