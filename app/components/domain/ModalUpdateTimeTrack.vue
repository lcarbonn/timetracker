<template>
  <div>
      <UModal
        :title="titleHead +' '+ title"
        v-model:open="modalUpdateTrack.show"
        scrollable 
        :dismissible="false">
        <template #body>
          <UFormField label="Start" :error="startDateState">
            <UiDatePicker 
              v-model="startDateForm"
              enable-time-picker
              :min-date="minDate"
              :max-date="maxDate"/>
          </UFormField>
          <UFormField v-if="isEnded" label="End" :error="endDateState">
            <UiDatePicker 
              v-model="endDateForm"
              enable-time-picker
              :min-date="minDate"
              :max-date="maxDate"/>
          </UFormField>
          </template>
          <template #footer>
            <UTooltip :text="'Delete this '+title">
              <UButton v-if="!isNew" @click="deleteTrack()" icon="streamline-color:recycle-bin-2-flat"/>
            </UTooltip>
            <UTooltip :text="'Restart this '+title">
              <UButton v-if="isRestart && isEnded" @click="restartTrack()" icon="streamline-color:arrow-round-left-flat"/>
            </UTooltip>
            <UTooltip :text="'Close this '+title">
              <UButton v-if="!isEnded"  class="mx-1" @click="closeTrack()" icon="streamline-color:delete-1-flat"/>
            </UTooltip>
            <UTooltip text="Add a pause">
              <UButton v-if="isTrack && !isNew && isEnded" class="mx-1" @click="addPause()">Add pause</UButton>
            </UTooltip>
            <UButton color="info" label="Cancel" @click="cancel" />
            <UTooltip :text="'Update this '+title">
              <UButton :label="titleHead" @click="preventOk" />
            </UTooltip>
            <UiSimpleModal 
              :open="modalDelete"
              :title="'Delete ' +title"
              description="Really ?"
              @on-ok="confirmDelete"/>
            <UiSimpleModal 
              :open="modalRestart"
              :title="'Restart ' +title"
              description="Really ?"
              @on-ok="confirmRestart"/>
          </template>
      </UModal>
  </div>
</template>

<script setup lang="ts">

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
  const modalDelete = ref(new ModalShow())
  const modalRestart = ref(new ModalShow())
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
    return startDateForm.value == null ? true:false
  })
  const endDateState = computed(() => {
    return endDateForm.value == null ? true:false
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
    modalDelete.value.show = !modalDelete.value.show
  }
  // confirm delete received
  const confirmDelete = () => {
    props.modalUpdateTrack.show = false
    modalDelete.value.show = !modalDelete.value.show
    emit('deleteTrack', props.timeTrack.id)
  }
  // ask for modal before restart
  const restartTrack = () => {
    modalRestart.value.show = !modalRestart.value.show
  }
  // confirm restart received
  const confirmRestart = () => {
    props.modalUpdateTrack.show = false
    modalRestart.value.show = !modalRestart.value.show
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
    props.modalUpdateTrack.show = false
  }

  // add pause action
  const addPause = () => {
    props.modalUpdateTrack.show = false
    emit('addPause')
  }
</script>
