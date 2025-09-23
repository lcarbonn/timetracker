<template>
  <div>
    <!-- <BRow>
      <BCol lg="4" class="my-1"> -->
        <BFormGroup
          label="Filter on Week :"
          label-for="filter-week"
          label-cols-sm="4"
        >
          <BInputGroup size="sm">
            <BFormSelect
              id="filter-week"
              v-model="filterWeek"
              :options="weekOptions"
            >
            </BFormSelect>
            <template #append>
              <BButton :disabled="!filterWeek" @click="filterWeek = week" ><X/></BButton>
            </template>
          </BInputGroup>
        </BFormGroup>
      <!-- </BCol>
    </BRow> -->
  </div>
</template>

<script setup lang="ts">

  // icons
  import X from '~icons/bi/x'

  // emits declaration
  const emit = defineEmits(['emitFilter'])

  // local ref properties
  const week = useWeek().value
  const filterWeek = ref(week)

  // computed properties
  const weekOptions = computed(() => {
    const opts:any[] = []
    const currentWeek = getWeekNumber(new Date())
    opts.push(
      { value: currentWeek, text: 'Current '+currentWeek }
    )
    for (let index = currentWeek-1; index > currentWeek-10; index--) {
      opts.push(
        { value: index, text: index }
      )
      
    }
    return opts
  })

  // watch local refs udpates
  watch(filterWeek, (newValue) => {
    if(newValue) useWeek().value = newValue
    emit('emitFilter')
  })
</script>
