<template>
  <div>
      <BModal
      v-model="modalUpdateTrack.show"
      id="modal-update"
      :title="titleHead +' '+ title"
      header-bg-variant="primary"
      size="lg"
      cancel-title="Cancel"
      no-close-on-backdrop
      :ok-title="titleHead"
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
          format="dd/MM/yyyy HH:mm"
          auto-apply
          enable-time-picker
          text-input
          :start-date="minDate"
          :min-date="minDate"
          :max-date="maxDate"
          prevent-min-max-navigation
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
          format="dd/MM/yyyy HH:mm"
          auto-apply
          enable-time-picker
          text-input
          :start-date="minDate"
          :min-date="minDate"
          :max-date="maxDate"
          prevent-min-max-navigation
          :state="endDateState"/>
        </BFormGroup>
        <BButton v-if="!isNew" class="mx-1" @click="deleteTrack()" size="sm" v-b-tooltip.focus.top="'Delete this '+title"><Trash/></BButton>
        <BButton v-if="isRestart && isEnded"  class="mx-1" @click="restartTrack()" size="sm" v-b-tooltip.focus.top="'Restart this '+title"><Reset/></BButton>
        <BButton v-if="!isEnded"  class="mx-1" @click="closeTrack()" size="sm" v-b-tooltip.focus.top="'Close this '+title">Close this {{title}}</BButton>
        <BButton v-if="isTrack && !isNew && isEnded" class="mx-1" @click="addPause()" size="sm" v-b-tooltip.focus.top="'Add a pause'">Add pause</BButton>
      </BModal>
      <BModal v-model="modalDelete" :title="'Delete ' +title" @ok="confirmDelete"> Really ? </BModal>
      <BModal v-model="modalRestart" :title="'Restart ' +title" @ok="confirmRestart"> Really ? </BModal>
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
    },
    minDate:Date,
    maxDate:Date
  })

  // emits declaration
  const emit = defineEmits(['updateTrack', 'deleteTrack', 'closeTrack', 'restartTrack', 'createTrack', 'addPause'])

  // local refs
  const startDateForm = ref(props.timeTrack.start)
  const endDateForm = ref(props.timeTrack.end)
  const modalDelete = ref(false)
  const modalRestart = ref(false)
  const isEnded = ref(props.timeTrack.extendedProps.isEnded)
  const isRestart = ref(props.timeTrack.extendedProps.isRestart)
  const isCloseAsked = ref(false)
  const isNew = ref(props.timeTrack.id?false:true)
  
  // watch track changes
  watch(() => props.timeTrack, (timeTrack) => {
    isNew.value = timeTrack.id?false:true
    startDateForm.value = timeTrack.start
    endDateForm.value = timeTrack.end
    isEnded.value = timeTrack.extendedProps.isEnded
    isRestart.value = timeTrack.extendedProps.isRestart
  })

  // computed properties
  const title = computed(() => {
    return props.timeTrack.extendedProps.isTrack?"Day":"Pause"
  })
  const titleHead = computed(() => {
    return isNew.value?"Add":"Update"
  })
  const startDateState = computed(() => {
    return startDateForm.value != null ? true:false
  })
  const endDateState = computed(() => {
    return endDateForm.value != null ? true:false
  })
  const isTrack = computed(() => {
    return props.timeTrack.extendedProps.isTrack
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
    if(isCloseAsked.value) {
      emit('closeTrack', props.timeTrack.id, start, end) 
      isCloseAsked.value = false
      return
    }
    if(isNew.value) {
      emit('createTrack', start, end)
      return
    }
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
  // ask for modal before restart
  const restartTrack = () => {
    modalRestart.value = !modalRestart.value
  }
  // confirm restart received
  const confirmRestart = () => {
    props.modalUpdateTrack.show = false
    const start = new Date(startDateForm.value)
    emit('restartTrack', props.timeTrack.id, start, null)
  }
  // ask for close track
  const closeTrack = () => {
    endDateForm.value = new Date()
    isEnded.value = true
    isCloseAsked.value = true
  }
  // reset in case of cancel
  const cancel = () => {
    // reset values
    isEnded.value = props.timeTrack.extendedProps.isEnded
    isCloseAsked.value = false
  }

  // add pause action
  const addPause = () => {
    props.modalUpdateTrack.show = false
    emit('addPause')
  }
</script>
