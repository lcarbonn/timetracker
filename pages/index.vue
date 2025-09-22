<template>
    <div>
      <BCard :title="'Today track for ' + user?.first_name" body-class="text-center">
        <BCardText><b>{{ today }}</b></BCardText>
        <BButton v-if="!todayTrack" size="lg" class="m-1" @click="startDay">Start my day</BButton>
        <BButton v-if="todayTrack && !todayTrack.End" size="lg" class="mx-1" @click="endDay">End my day</BButton>
        <BButton v-if="todayTrack && todayTrack.End" class="mx-1" @click="restartDay">Restart my day</BButton>
        <BCardText v-if="todayTrack && !todayTrack.End"> Day started at : <b>{{ todayStartTime }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End">  Day started at : <b>{{ todayStartTime }}</b> - ended at : <b>{{ todayEndTime }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End"> Duration : <b>{{ todayTrack.Duration }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End"> Pause Duration : <b>{{ todayTrack.PauseDuration }}</b></BCardText>
        <BCardText v-if="todayTrack && !todayTrack.End"> Timer : <b>{{ timer }}</b></BCardText>
      </BCard>
      <BCard title="Current pause" v-if="todayTrack && !todayTrack.End" body-class="text-center">
        <BButton v-if="!currentPause" size="lg" class="mx-1" @click="startPause">Have a break</BButton>
        <BButton v-if="currentPause && !currentPause.End" size="lg" class="mx-1" @click="endPause">Back to work</BButton>
        <BCardText v-if="currentPause">  Pause started at : <b>{{ currentPauseStartTime }}</b></BCardText>
      </BCard>
      <BCard title="Pauses for today">
        <DomainPauseTracksTable :pauses="todayPauses" @delete-pause="deletePause" @reopen-pause="restartPause"/>
      </BCard>
      <BModal v-model="modalRestartDay" title="Restart day" @ok="confirmRestartDay"> Really ? </BModal>
      <BModal v-model="modalDeletePause" title="Delete pause" @ok="confirmDeletePause"> Really ? </BModal>
      <BModal v-model="modalRestartPause" title="Restart pause" @ok="confirmRestartPause"> Really ? </BModal>
    </div>
</template>

<script setup lang="ts">
import { getStateTodayTimeTrack, reopenTimeTrack } from '~/composables/useTimeTrack'
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
    getStateTimeTracksWeekUid(user.value.id, useWeek().value)
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
      startChrono()
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
    // if(!todayTrack.value?.End) {
    //   startChrono()
    // }
    return text
  })

  // display for today
  const today = computed(() => {
    return now.toLocaleDateString().substring(0,10)
  })

  // const for chrono
  const timer = ref()
  const chrono = ref()
  
  const startChrono = () => {
      chrono.value = setInterval(() => {
        getChrono()
      }, 1000);
  }

  // methods
  const getChrono = ()  => {
    const thousand = 1000;
    const sixty = 60;
    const twentyfour = 24;    
    let duration:string
    if(todayTrack.value?.Start) {
      const start = new Date(todayTrack.value.Start)
      const now = new Date()
      const t = now.getTime()-start.getTime()
      const days = Math.floor(t / (thousand * sixty * sixty * twentyfour));
      const hours = Math.floor((t % (thousand * sixty * sixty * twentyfour)) / (thousand * sixty * sixty));
      const minutes = Math.floor((t % (thousand * sixty * sixty)) / (thousand * sixty));
      const seconds = Math.floor((t % (thousand * sixty)) / thousand);
      duration = days +"d:"+hours+"h:"+minutes+"m:"+seconds+"s"
      timer.value = duration
    }
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
    clearInterval(chrono.value)
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

  const emitFilter = () => {
    if(user.value) getStateTimeTracksWeekUid(user.value.id, useWeek().value)
  }

</script>