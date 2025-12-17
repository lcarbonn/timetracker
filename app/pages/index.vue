<template>
    <div>
      <DomainHeaderToday
        :todayTrack="todayTrack"
        :currentPause="currentPause"
        @startDay="startDay"
        @endDay="endDay"
        @startPause="startPause"
        @endPause="endPause"
        @restartDay="restartDay"/>
      <DomainCalendar v-if="tracks" 
        :tracks="tracks"
        @update-track="updateTrack"
        @close-track="closeTrack"
        @delete-track="deleteTrack"
        @create-track="createTrack"
        @restart-track="restartTrack"/>
      <UiSimpleModal
        :open="openModalRestartDay" 
        title="Restart day"
        description="Do you really want to restart your day ?"
        @on-ok="confirmRestartDay"/>
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
  const openModalRestartDay = ref(new ModalShow())
  const selectedTrack = ref()
  const tracks = computed(() => {
    const tracks = []
    if(todayTrack.value) tracks.push(todayTrack.value)
    return tracks
  })

  // init at setup
  // cannot be called in a method at setup
  todayTrack.value = await getLastOpenTrack(uid)
  if(todayTrack.value) {
    const timeId = todayTrack.value.id
    if(timeId) {
      const pauses = await getPausesOfTrack(timeId)
      if(pauses) refreshPausesInStateTrack(pauses)
    }
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
    }
  }

  // restart today track
  const restartDay = () => {
    selectedTrack.value = useStateTrack().value
    openModalRestartDay.value.show = !openModalRestartDay.value.show
  }

  // confirm restart received
  const confirmRestartDay = () => {
    openModalRestartDay.value.show = !openModalRestartDay.value.show
    reopenTimeTrack(selectedTrack.value.id)
  }

  const restartTrack = (track:any) => {
    updateTrack(track)
    // if pause reopened, then reopen the current day also
    if(!track.isTrack && todayTrack.value) { 
      reopenTimeTrack(todayTrack.value.id)
    }
  }
  const closeTrack = (track:any) => {
    updateTrack(track)
    // if day closed, then clause current pause also
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
        if(todayTrack.value?.End) {
          todayTrack.value = await getLastOpenTrack(uid)
          const timeId = todayTrack.value.id
          if(timeId) {
            const pauses = await getPausesOfTrack(timeId)
            if(pauses) refreshPausesInStateTrack(pauses)
          }
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