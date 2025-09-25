<template>
  <div>
      <BModal
      v-model="modalUpdateTrack.show"
      id="modal-update"
      title="Update event"
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
        <BButton class="mx-1" @click="deleteTrack()" size="sm" v-b-tooltip.focus.top="'Delete this event'"><Trash/></BButton>
      </BModal>
      <BModal v-model="modalDelete" title="Delete event" @ok="confirmDelete"> Really ? </BModal>
  </div>
</template>

<script setup lang="ts">

  // import datepicker vue component
  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'

  // icons
  import Trash from '~icons/bi/trash'

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
  const emit = defineEmits(['updateTrack', 'deleteTrack'])

  // local refs
  const startDateForm = ref(props.timeTrack.start)
  const endDateForm = ref(props.timeTrack.end)
  const modalDelete = ref(false)
  
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

  // ask for modal before delete
  const deleteTrack = () => {
    modalDelete.value = !modalDelete.value
  }
  // confirm delete received
  const confirmDelete = () => {
    props.modalUpdateTrack.show = false
    emit('deleteTrack', props.timeTrack.id)
  }

</script>
