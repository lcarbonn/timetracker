<template>
    <div>
      <UPageGrid>
        <UFormField label="User">
          <USelect v-model="filterUser" :items="users" placeholder="Select a user" class="w-48"/>
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
    </div>
</template>

<script setup lang="ts">
  import type { SelectItem } from '@nuxt/ui';

  // props
  const props = defineProps<{
      users:SelectItem[]
    }>()

  const filter = ref<Filter>()
  const filterUser = ref()
  const filterYear = ref()
  const filterMonth = ref()

  const years = ref(['2026', '2025', '2024'])
  const months = getMonthSelectItems() //ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])

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
  // emits declaration
  const emit = defineEmits<{
    filter: [Filter];
  }>()

  // emit the filter query
  const filterTracks = () => {
    if(filter.value) emit('filter', filter.value)
  }

  // reset the filters
  const resetAllFilter = () => {
    filterUser.value = null
    filterYear.value = null
    filterMonth.value = null
    // filterTracks()
    // pageIndex.value = 0
  }


</script>