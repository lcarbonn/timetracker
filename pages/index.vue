<template>
    <div>
      <BCard :title="'Today track for ' + user?.first_name" body-class="text-center">
        <BButton v-if="!todayTrack" size="lg" class="m-1" @click="startDay">Start my day</BButton>
        <BButton v-if="todayTrack && !todayTrack.End" size="lg" class="mx-1" @click="endDay">End my day</BButton>
        <BButton v-if="todayTrack && todayTrack.End" class="mx-1" @click="restartDay">Restart my day</BButton>
        <BCardText v-if="todayTrack && !todayTrack.End"> Day started at : <b>{{ todayStartTime }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End">  Day started at : <b>{{ todayStartTime }}</b> - ended at : <b>{{ todayEndTime }}</b></BCardText>
        <BCardText v-if="todayTrack && todayTrack.End">
          Duration : <b>{{ formatDuration(todayTrack.Duration) }}</b> 
          - Pause Duration : <b>{{ formatDuration(todayTrack.PauseDuration) }}</b> 
          - Effective Duration : <b>{{ formatDuration(todayTrack.EffectiveDuration) }}</b>
        </BCardText>
        <BCardText v-if="todayTrack && !todayTrack.End"> Timer : <b>{{ dayTimer }}</b></BCardText>
        <BButton v-if="todayTrack && !todayTrack.End && !currentPause" size="lg" class="mx-1" @click="startPause" variant="primary">Have a break</BButton>
        <BButton v-if="todayTrack && currentPause && !currentPause.End" size="lg" class="mx-1" @click="endPause" variant="primary">Back to work</BButton>
        <BCardText v-if="currentPause && !currentPause.End">  Pause started at : <b>{{ currentPauseStartTime }}</b></BCardText>
        <BCardText v-if="currentPause && !currentPause.End"> Duration : <b>{{ pauseTimer }}</b></BCardText>
      </BCard>
      <DomainCalendar v-if="tracks" 
        :tracks="tracks"
        @update-track="updateTrack"
        @close-track="closeTrack"
        @delete-track="deleteTrack"
        @restart-track="restartTrack"/>
      <BModal v-model="modalRestartDay" title="Restart day" @ok="confirmRestartDay"> Really ? </BModal>
    </div>
</template>

<script setup lang="ts">

  // middleware
  definePageMeta({
    middleware: 'auth'
  })

  const { user } = useUserSession()

  // const
  const uid = user.value?user.value.id:0
  const now = new Date()
  const currentWeek:number = getWeekNumber(now)

  // local refs
  const todayTrack = useStateTrack()
  const currentPause = useStatePause()

  // local refs
  const modalRestartDay = ref(false)
  const selectedTrack = ref()
  const tracks = computed(() => {
    const tracks = []
    if(todayTrack.value) tracks.push(todayTrack.value)
    return tracks
  })


  // init at setup
  // const { data } = await useAsyncData('fetchTrack', () => getTrackOfTheDay(uid))
  const { data } = await useAsyncData('fetchTrack', () => getLastOpenTrack(uid))
  if(data.value) {
      todayTrack.value = data.value as ITimeTrack
      const timeId = todayTrack.value.id
      if(timeId) {
        const pauses = await getPausesOfTrack(timeId)
        if(pauses) refreshPausesInStateTrack(pauses)
      }
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
      .then((tt) => {
        messageToSnack("Day started at "+new Date(tt.Start).toLocaleString())
      })
    }
  }

  // ending the day
  const endDay = () => {
    if(todayTrack.value) {
      closeTimeTrack(todayTrack.value.id)
      .then((tt) => {
        endPause()
        if(tt.End) messageToSnack("Day end at "+new Date(tt.End).toLocaleString())
      })
    }
    clearInterval(dayChrono.value)
  }

  // staring a pause
  const startPause = () => {
    if(todayTrack.value) {
      openPauseTrack(todayTrack.value.id)
      .then((tt) => {
        messageToSnack("Pause started at "+new Date(tt.Start).toLocaleString())
      })
    }
  }
  // ending a pause
  const endPause = () => {
    if(currentPause.value) {
      closePauseTrack(currentPause.value.id)
      .then((tt) => {
        if(tt.End) messageToSnack("Pause ended at "+new Date(tt.End).toLocaleString())
      })
      clearInterval(pauseChrono.value)
    }
  }

  // restart today track
  const restartDay = () => {
    selectedTrack.value = useStateTrack().value
    modalRestartDay.value = !modalRestartDay.value
  }

  // confirm restart received
  const confirmRestartDay = () => {
    reopenTimeTrack(selectedTrack.value.id)
  }

  const restartTrack = (track:any) => {
    updateTrack(track)
    // if pause reopen, reopen day also
    if(!track.isTrack && todayTrack.value) { 
      reopenTimeTrack(todayTrack.value.id)
    }
  }
  const closeTrack = (track:any) => {
    updateTrack(track)
    // if day closed, the clause current pause also
    if(track.isTrack && currentPause.value) { 
      closePauseTrack(currentPause.value.id)
    }
  }
  const updateTrack = (track:any) => {
    // alert(track.id + " was dropped on " + track.start.toISOString() + ', isTrack:'+track.isTrack)
    if(track.isTrack) {
      updateTimeTrack(track.id, track.start, track.end )
      .then((tt) => {
        messageToSnack("Day changed to "+new Date(tt.Start).toLocaleString())
      })
    } else {
      updatePauseTrack(track.id, track.start, track.end )
      .then((pt) => {
        messageToSnack("Pause changed to "+new Date(pt.Start).toLocaleString())
      })
    }
  }

  const deleteTrack = (track:any) => {
    if(track.isTrack) {
      deleteTimeTrack(track.id )
      .then(() => {
        // todayTrack.value = undefined
        messageToSnack("Day deleted")
      })
    } else {
      deleteStatePause(track.id)
      .then((pt) => {
        // deletePauseFromStateTrack(track.id)
        messageToSnack("Pause deleted")
      })
    }
  }
</script>