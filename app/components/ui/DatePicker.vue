<template>
    <UFieldGroup class="w-full">
      <UInputDate
          v-model="internalDate"
          class="w-full"
          :min-value="minDateValue"
          :max-value="maxDateValue">
          <template #leading>
            <UPopover v-model:open="open">
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-calendar"
                aria-label="Choisir une date"
                class="px-0"
                />
              <template #content>
                <UPageCard :ui="{wrapper:'items-center'}">
                  <template #body>
                  <UCalendar
                    v-model="internalDate"
                    :min-value="minDateValue"
                    :max-value="maxDateValue"
                    />
                    </template>
                  <template #footer>
                    <UButton @click="setNow" size="sm">Now</UButton>
                  </template>
                </UPageCard>
              </template>
            </UPopover>
          </template>
      </UInputDate>
      <UInputTime
        v-if="enableTimePicker"
        v-model="internalTime" 
        :hour-cycle="24"
        >
          <template #leading>
            <UPopover v-model:open="openTime">
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-clock"
                aria-label="Choisir une date"
                class="px-0"
                />
              <template #content>
                <UPageCard>
                  <UInputNumber v-if="internalTime" v-model="internalHour"/>
                  <UInputNumber v-if="internalTime" v-model="internalMinute" />
                </UPageCard>
              </template>
            </UPopover>
          </template>

      </UInputTime>
      <UButton
          color="neutral"
          variant="subtle"
          size="sm"
          icon="i-lucide-x"
          aria-label="Clear input"
          @click="internalDate = null; open = false"
        />
    </UFieldGroup>
</template>
<script setup lang="ts">

  // import calendar date
  import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date'

  interface Props {
    modelValue: Date | null | undefined,
    minDate?: Date,
    maxDate?: Date,
    enableTimePicker? : boolean | undefined
  }

  const props = withDefaults(defineProps<Props>(), {
    enableTimePicker : false
  })

  const open = ref(false)
  const openTime = ref(false)

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Date | null): void
  }>()
  
  /**
   * Conversion sécurisée en Date
   */
  function toDate(value?: Date | null ): CalendarDate | null {
    if (!value) return null
    return new CalendarDate(value.getFullYear(), (value.getMonth()+1), value.getDate())
  }

  // min date for calendar
  const minDateValue = computed<CalendarDate | undefined>(()=> {
    if (!props.minDate) return undefined
    return new CalendarDate(props.minDate.getFullYear(), (props.minDate.getMonth()+1), props.minDate.getDate())
  })
  // max date for calendar
  const maxDateValue = computed<CalendarDate | undefined>(()=> {
    if (!props.maxDate) return undefined
    return new CalendarDate(props.maxDate.getFullYear(), (props.maxDate.getMonth()+1), props.maxDate.getDate())
  })
  // internal date for calendar
  const internalDate = computed<CalendarDate | null>({
    get() {
      return toDate(props.modelValue)
    },
    set(value) {
      const date = value?.toDate(getLocalTimeZone())
      if(internalTime.value) {
        date?.setHours(internalTime.value.hour)
        date?.setMinutes(internalTime.value.minute)
      }
      emit('update:modelValue', date?date:null)
      open.value = false
    }
  })
  // internal time for hours/minutes
  const internalTime = computed<Time | null>({
    get() {
      let time = null
      if(props.modelValue) time = new Time(props.modelValue.getHours(), props.modelValue.getMinutes())
      return time
    },
    set(value) {
      const date = internalDate.value?.toDate(getLocalTimeZone())
      if(value) {
        date?.setHours(value?.hour)
        date?.setMinutes(value.minute)
      }
      emit('update:modelValue', date?date:null)
      // open.value = false
    }
  })  

  // internal hour
  const internalHour = computed<number | null>({
    get() {
      let time = null
      if(props.modelValue) time = props.modelValue.getHours()
      return time
    },
    set(value) {
      const date = internalDate.value?.toDate(getLocalTimeZone())
      if(value) {
        date?.setHours(value)
        if(props.modelValue) date?.setMinutes(props.modelValue.getMinutes())
      }
      emit('update:modelValue', date?date:null)
      // open.value = false
    }
  })  
  // internal minute
  const internalMinute = computed<number | null>({
    get() {
      let time = null
      if(props.modelValue) time = props.modelValue.getMinutes()
      return time
    },
    set(value) {
      const date = internalDate.value?.toDate(getLocalTimeZone())
      if(value) {
        if(props.modelValue?.getHours()) date?.setHours(props.modelValue.getHours())
        date?.setMinutes(value)
      }
      emit('update:modelValue', date?date:null)
      // open.value = false
    }
  })  

  const setNow = () => {
    const now = new Date()
    internalDate.value = new CalendarDate(now.getFullYear(), now.getMonth()+1, now.getDate())
  }
</script>