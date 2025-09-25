<template>
  <div>
      <BModal
      v-model="modalUpdateTrack.show"
      id="modal-update"
      title="Update time track"
      centered
      header-bg-variant="primary"
      size="lg"
      cancel-title="Cancel"
      ok-title="Update"
      @ok.prevent="preventOk">
        <BFormGroup
          label="Start"
          label-for="startDate"
          label-cols-sm="3"
          label-size="sm"
          label-align-sm="left"
          class="mb-0"
        >
        <VueDatePicker id="startDate"
          v-model="startDateForm" 
          auto-apply 
          enable-time-picker
          time-picker-inline
          minutes-increment="5"
          text-input
          :state="startDateState"/>
        </BFormGroup>
        <BFormGroup
          v-if="timeTrack.extendedProps.isEnded"
          label="End"
          label-for="endDate"
          label-cols-sm="3"
          label-size="sm"
          label-align-sm="left"
          class="mb-0"
        >
        <VueDatePicker id="endDate"
          v-model="endDateForm" 
          auto-apply 
          enable-time-picker
          time-picker-inline
          minutes-increment="5"
          text-input
          :state="endDateState"/>
        </BFormGroup>
      </BModal>
  </div>
</template>

<script setup lang="ts">

  // import datepicker vue component
  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'

  // props
  const props = defineProps({
    modalUpdateTrack: {
        type: ModalShow,
        default: new ModalShow()
    },
    timeTrack: {
        type: Object,
        default: null
    },
  })

  // emits declaration
  const emit = defineEmits(['updateTrack'])

  // local refs
  const startDateForm = ref(props.timeTrack.start)
  const endDateForm = ref(props.timeTrack.end)

  watch(() => props.timeTrack, (timeTrack) => {
    startDateForm.value = timeTrack.start
    endDateForm.value = timeTrack.end
  })

  const startDateState = computed(() => {
    return startDateForm.value != null ? true:false
  })
  const endDateState = computed(() => {
    return endDateForm.value != null ? true:false
  })

  const preventOk = () => {
    if(startDateForm.value && endDateForm.value) {
      props.modalUpdateTrack.show = false
      submit()
    }
  }
  const submit = () => {
    const start = new Date(startDateForm.value)
    const end = new Date(endDateForm.value)
    emit('updateTrack', props.timeTrack.id, start, end)
  }
</script>
