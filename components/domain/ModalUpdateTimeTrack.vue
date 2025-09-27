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
      @ok.prevent="preventOk"
      @cancel="cancel">
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
          v-if="isEnded"
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
        <BButton v-if="isRestart && isEnded"  class="mx-1" @click="restartTrack()" size="sm" v-b-tooltip.focus.top="'Restart this event'"><Reset/></BButton>
        <BButton v-if="!isEnded"  class="mx-1" @click="closeTrack()" size="sm" v-b-tooltip.focus.top="'End this event'">Close this event</BButton>
      </BModal>
      <BModal v-model="modalDelete" title="Delete event" @ok="confirmDelete"> Really ? </BModal>
      <BModal v-model="modalRestart" title="Restart event" @ok="confirmRestart"> Really ? </BModal>
  </div>
</template>

<script setup lang="ts">

  // import datepicker vue component
  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'

  // icons
  import Trash from '~icons/bi/trash'
  import Reset from '~icons/bi/arrow-counterclockwise'

  // props
  const props = defineProps({
    modalUpdateTrack: {
        type: ModalShow,
        default: new ModalShow()
    },
    timeTrack: {
        type: Object,
        default: null
    }
  })

  // emits declaration
  const emit = defineEmits(['updateTrack', 'deleteTrack', 'closeTrack'])

  // local refs
  const startDateForm = ref(props.timeTrack.start)
  const endDateForm = ref(props.timeTrack.end)
  const modalDelete = ref(false)
  const modalRestart = ref(false)
  const isEnded = ref(props.timeTrack.extendedProps.isEnded)
  const isRestart = ref(props.timeTrack.extendedProps.isRestart)
  const isCloseAsked = ref(false)
  
  // watch track changes
  watch(() => props.timeTrack, (timeTrack) => {
    startDateForm.value = timeTrack.start
    endDateForm.value = timeTrack.end
    isEnded.value = timeTrack.extendedProps.isEnded
    isRestart.value = timeTrack.extendedProps.isRestart
  })

  // computed properties
  const startDateState = computed(() => {
    return startDateForm.value != null ? true:false
  })
  const endDateState = computed(() => {
    return endDateForm.value != null ? true:false
  })

  // close modal on ok before send submit
  const preventOk = () => {
    if(startDateForm.value && endDateForm.value) {
      props.modalUpdateTrack.show = false
      submit()
    }
  }
  // submit form
  const submit = () => {
    const start = new Date(startDateForm.value)
    const end = new Date(endDateForm.value)
    if(isCloseAsked.value) emit('closeTrack', props.timeTrack.id, start, end)
    else emit('updateTrack', props.timeTrack.id, start, end)
    isCloseAsked.value = false
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
  // ask for modal before restart
  const restartTrack = () => {
    modalRestart.value = !modalRestart.value
  }
  // confirm restart received
  const confirmRestart = () => {
    props.modalUpdateTrack.show = false
    const start = new Date(startDateForm.value)
    emit('updateTrack', props.timeTrack.id, start, null)
  }
  // ask for close track
  const closeTrack = () => {
    // // modalRestart.value = !modalRestart.value
    endDateForm.value = new Date()
    isEnded.value = true
    isCloseAsked.value = true
  }
  const cancel = () => {
    // // endDateForm.value = props.timeTrack.end
    isEnded.value = props.timeTrack.extendedProps.isEnded
    isCloseAsked.value = false
  }
</script>
