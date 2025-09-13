<template>
  <div>
    <BRow>
      <BCol lg="4" class="my-1">
        <BFormGroup
          label="Year"
          label-for="filter-year"
        >
          <BInputGroup size="sm">
            <BFormSelect
              id="filter-year"
              v-model="filterYear"
              :options="yearOptions"
            >
            <!-- <template #first>
              <BFormSelectOption :value="2025" disabled>-- Choose a year --</BFormSelectOption>
            </template> -->
            </BFormSelect>
            <template #append>
              <BButton :disabled="!filterYear" @click="filterYear = year" ><X/></BButton>
            </template>
          </BInputGroup>
        </BFormGroup>
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">

  // icons
import X from '~icons/bi/x'

  // emits declaration
  const emit = defineEmits(['emitFilter'])

  // local ref properties
  const year = useYear().value
  const filterYear = ref(year)

  // computed properties
  const yearOptions = computed(() => {
    return [
      { value: year, text: ''+year },
      { value: 2024, text: '2024' },
    ]
  })

  // watch local refs udpates
  watch(filterYear, (newValue) => {
    if(newValue) useYear().value = newValue
    emit('emitFilter')
  })
</script>
