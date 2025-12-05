<template>
    <div>
      <UPageCard :title="'Today track for ' + user?.first_name">
        <template #footer>
          <USeparator label="Track"/>
          <UButton v-if="!todayTrack" @click="startDay">Start my day</UButton>
          <UButton v-if="todayTrack && !todayTrack.End" @click="endDay">End my day</UButton>
          <UButton v-if="todayTrack && todayTrack.End" @click="restartDay">Restart my day</UButton>
          <p v-if="todayTrack && !todayTrack.End"> Day started at : <b>{{ todayStartTime }}</b></p>
          <p v-if="todayTrack && todayTrack.End">  Day started at : <b>{{ todayStartTime }}</b> - ended at : <b>{{ todayEndTime }}</b></p>
          <p v-if="todayTrack && todayTrack.End">
            Duration : <b>{{ formatDuration(todayTrack.Duration) }}</b> 
            - Pause Duration : <b>{{ formatDuration(todayTrack.PauseDuration) }}</b> 
            - Effective Duration : <b>{{ formatDuration(todayTrack.EffectiveDuration) }}</b>
          </p>
          <p v-if="todayTrack && !todayTrack.End"> Timer : <b>{{ dayTimer }}</b></p>
          <USeparator label="Pause" v-if="todayTrack && !todayTrack.End"/>
          <UButton v-if="todayTrack && !todayTrack.End && !currentPause" @click="startPause">Have a break</UButton>
          <UButton v-if="todayTrack && currentPause && !currentPause.End" @click="endPause">Back to work</UButton>
          <p v-if="currentPause && !currentPause.End">  Pause started at : <b>{{ currentPauseStartTime }}</b></p>
          <p v-if="currentPause && !currentPause.End"> Duration : <b>{{ pauseTimer }}</b></p>
        </template>
      </UPageCard>
      <DomainCalendar v-if="tracks" 
        :tracks="tracks"
        @update-track="updateTrack"
        @close-track="closeTrack"
        @delete-track="deleteTrack"
        @create-track="createTrack"
        @restart-track="restartTrack"/>
      <UModal v-model:open="modalRestartDay" title="Restart day" description="Do you really want to restart your day ?">
        <template #footer="{ close }">
          <UButton label="Cancel" color="info" @click="close"/>
          <UButton label="Ok" @click="confirmRestartDay" />
        </template>
      </UModal>
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
  const getTodayTrackAndPauses = async () => {
    const data = await getLastOpenTrack(uid)
    if(data) {
        todayTrack.value = data as ITimeTrack
        const timeId = todayTrack.value.id
        if(timeId) {
          const pauses = await getPausesOfTrack(timeId)
          if(pauses) refreshPausesInStateTrack(pauses)
        }
    }
  }
  getTodayTrackAndPauses()

  // computed properties
  // start time of the day
  const todayStartTime = computed(() => {
    let text = ""
    if(todayTrack.value?.Start) {
      const start = new Date(todayTrack.value.Start)
      text = start.toLocaleDateString() +" - "+start.toLocaleTimeString()
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
    return text
  })

  // const for chrono
  const dayTimer = ref()
  const dayChrono = ref()
  
  const pauseTimer = ref()
  const pauseChrono = ref()

  // managing timer only on client side
  onNuxtReady(async () => {
    const startPauseChrono = () => {
      pauseChrono.value = setInterval(() => {
        if(currentPause.value?.Start)
          pauseTimer.value = formatTimer(new Date(currentPause.value.Start))
        }, 1000);
    }
    const startDayChrono = () => {
      dayChrono.value = setInterval(() => {
        if(todayTrack.value?.Start)
          dayTimer.value = formatTimer(new Date(todayTrack.value.Start))
        }, 1000);
    }
    // start at init if track not ended
    if(!todayTrack.value?.End) {
      startDayChrono()
    }
    // watch track changes
    watch(todayTrack, ()=> {
      if(!todayTrack.value?.End) {
        startDayChrono()
      }
    })
    // start at init if pause not ended
    if(!currentPause.value?.End) {
      startPauseChrono()
    }
    // watch pause changes
    watch(currentPause, ()=> {
      if(!currentPause.value?.End) {
        startPauseChrono()
      }
    })
  })

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
    modalRestartDay.value = !modalRestartDay.value
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
    if(track.isTrack) {
      updateTimeTrack(track.id, track.start, track.end )
      .then((tt) => {
        messageToSnack("Day changed to "+new Date(tt.Start).toLocaleString())
      })
    } else {
      updatePauseTrack(track.id, track.start, track.end )
      .then(async (pt) => {
        messageToSnack("Pause changed to "+new Date(pt.Start).toLocaleString())
        // refresh today track if ended
        if(todayEndTime.value!="") {
          getTodayTrackAndPauses()
        }
      })
    }
  }

  const deleteTrack = (track:any) => {
    if(track.isTrack) {
      deleteTimeTrack(track.id )
      .then(() => {
        messageToSnack("Day deleted")
      })
    } else {
      deleteStatePause(track.id)
      .then((pt) => {
        messageToSnack("Pause deleted")
      })
    }
  }

  // create track
  const createTrack = (track:any) => {
    if(!user.value) return
    if(track.isTrack) {
      createTimeTrack(user.value?.id, track.start, track.end )
      .then((tt) => {
        messageToSnack("Day added to "+new Date(tt.Start).toLocaleString())
      })
    } else {
      createPauseTrack(track.timeId, track.start, track.end )
      .then((pt) => {
        if(pt) {
        messageToSnack("Pause added to "+new Date(pt.Start).toLocaleString())
        }
      })
    }
  }

</script>