<template>
    <div>
      <BCard :title="'Today track for ' + user?.first_name" body-class="text-center">
        <!-- <BCardText><b>{{ today }}</b></BCardText> -->
        <BButton v-if="!todayTrack" size="lg" class="m-1" @click="startDay">Start my day</BButton>
        <BButton v-if="todayTrack && !todayTrack.End" size="lg" class="mx-1" @click="endDay">End my day</BButton>
        <BButton v-if="todayTrack && todayTrack.End" class="mx-1" @click="restartDay">Restart my day</BButton>
        <BCardText v-if="todayTrack && !todayTrack.End"> Day started at : <b>{{ todayStartTime }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End">  Day started at : <b>{{ todayStartTime }}</b> - ended at : <b>{{ todayEndTime }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End"> Duration : <b>{{ formatDuration(todayTrack.Duration) }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End"> Pause Duration : <b>{{ formatDuration(todayTrack.PauseDuration) }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End"> Effective Duration : <b>{{ formatDuration(todayTrack.EffectiveDuration) }}</b></BCardText>
        <BCardText v-if="todayTrack && !todayTrack.End"> Timer : <b>{{ dayTimer }}</b></BCardText>
        <BButton v-if="!currentPause" size="lg" class="mx-1" @click="startPause" variant="primary">Have a break</BButton>
        <BButton v-if="currentPause && !currentPause.End" size="lg" class="mx-1" @click="endPause" variant="primary">Back to work</BButton>
      </BCard>
      <BCard title="Current pause" v-if="currentPause" body-class="text-center">
        <BCardText v-if="currentPause">  Pause started at : <b>{{ currentPauseStartTime }}</b></BCardText>
        <BCardText v-if="currentPause"> Duration : <b>{{ pauseTimer }}</b></BCardText>
      </BCard>
      <DomainCalendarDay :today-track="todayTrack" :today-pauses="todayPauses"/>
      <BCard title="Pauses for today">
        <DomainPauseTracksTable :disabled="disabled" :pauses="todayPauses" @delete-pause="deletePause" @reopen-pause="restartPause"/>
      </BCard>
      <BModal v-model="modalRestartDay" title="Restart day" @ok="confirmRestartDay"> Really ? </BModal>
      <BModal v-model="modalDeletePause" title="Delete pause" @ok="confirmDeletePause"> Really ? </BModal>
      <BModal v-model="modalRestartPause" title="Restart pause" @ok="confirmRestartPause"> Really ? </BModal>
    </div>
</template>

<script setup lang="ts">
  import type { IPauseTrack } from '~/types/tablePauseTrack'

  // middleware
  definePageMeta({
    middleware: 'auth'
  })

  const { user } = useUserSession()

  // const
  const now = new Date()
  const currentWeek:number = getWeekNumber(now)

  useWeek().value = currentWeek



  // local refs
  const todayTrack = useTimeTrack()
  const todayPauses = usePauseTracks()
  const currentPause = usePauseTrack()

  // local refs
  const modalRestartDay = ref(false)
  const selectedTrack = ref()
  const modalDeletePause = ref(false)
  const modalRestartPause = ref(false)
  const selectedPause = ref()

  if(user.value) {
    getStateTodayTimeTrack(user.value.id)
  }

  // computed properties
  // start time of the day
  const todayStartTime = computed(() => {
    let text = ""
    if(todayTrack.value?.Start) {
      const start = new Date(todayTrack.value.Start)
      text = start.toLocaleDateString() +" - "+start.toLocaleTimeString()
    }
    if(!todayTrack.value?.End) {
      startDayChrono()
    }
    return text
  })

  // end time of the day
  const todayEndTime = computed(() => {
    let text = ""
    if(todayTrack.value?.End) {
      const end = new Date(todayTrack.value.End)
      text = end.toLocaleDateString() +" - "+end.toLocaleTimeString()
    }
    return text
  })

    // start time of the current pause
  const currentPauseStartTime = computed(() => {
    let text = ""
    if(currentPause.value?.Start) {
      const start = new Date(currentPause.value.Start)
      text = start.toLocaleDateString() +" - "+start.toLocaleTimeString()
    }
    if(!currentPause.value?.End) {
      startPauseChrono()
    }
    return text
  })

  // display for today
  const today = computed(() => {
    return now.toLocaleDateString().substring(0,10)
  })

    // disabled for pause compoenent
  const disabled = computed(() => {
    return todayTrack.value?.End!=null
  })

  // const for chrono
  const dayTimer = ref()
  const dayChrono = ref()
  
  const startDayChrono = () => {
    dayChrono.value = setInterval(() => {
      if(todayTrack.value?.Start)
        dayTimer.value = formatTimer(new Date(todayTrack.value.Start))
      }, 1000);
  }

  const pauseTimer = ref()
  const pauseChrono = ref()
  
  const startPauseChrono = () => {
    pauseChrono.value = setInterval(() => {
      if(currentPause.value?.Start)
        pauseTimer.value = formatTimer(new Date(currentPause.value.Start))
      }, 1000);
  }

  // starting the day
  const startDay = () => {
    if(user.value) {
      openTimeTrack(user.value.id)
    }
  }

  // ending the day
  const endDay = () => {
    if(todayTrack.value) closeTimeTrack(todayTrack.value.id)
    clearInterval(dayChrono.value)
  }

  // staring a pause
  const startPause = () => {
    if(todayTrack.value) {
      openPauseTrack(todayTrack.value.id)
    }
  }
  // ending a pause
  const endPause = () => {
    if(currentPause.value) {
      closePauseTrack(currentPause.value.id)
      clearInterval(pauseChrono.value)
    }
  }

  // restart today track
  const restartDay = () => {
    selectedTrack.value = useTimeTrack().value
    modalRestartDay.value = !modalRestartDay.value
  }

  // confirm restart received
  const confirmRestartDay = () => {
    if(selectedTrack.value) reopenTimeTrack(selectedTrack.value.id)
  }

    // ask for modal before delete
  const deletePause = (pause:IPauseTrack) => {
    selectedPause.value = pause
    modalDeletePause.value = !modalDeletePause.value
  }
  // confirm delete received
  const confirmDeletePause = () => {
    if(selectedPause.value) deleteStatePause(selectedPause.value.id)
    selectedPause.value = null
  }

  // restart today track
  const restartPause = (pause:IPauseTrack) => {
    selectedPause.value = pause
    modalRestartPause.value = !modalDeletePause.value
  }

  // confirm restart received
  const confirmRestartPause = () => {
    if(selectedPause.value) reopenPauseTrack(selectedPause.value.id)
  }

</script>