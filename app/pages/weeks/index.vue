<template>
    <div>
      <UPageCard
        :title="'Your week '+selectedWeek+' calendar for ' + user?.first_name">
        <template #footer>
          Effective Duration : <b>{{ effectiveDuration }}</b>
        </template>
      </UPageCard>
      <DomainCalendar v-if="tracks" 
        is-week-grid 
        :selectedWeek="selectedWeek" 
        :tracks="tracks" 
        @nav-to-week="navToWeek"
        @update-track="updateTrack"
        @close-track="closeTrack"
        @create-track="createTrack"
        @delete-track="deleteTrack"
        class="mt-4"/>
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
  const selectedWeek =  ref(currentWeek)
  const tracks = useStateTracksOfTheWeek()

  // load tracks and listen to week change
  const data = await getTracksOfTheWeek(uid, selectedWeek.value)
  if(data) {
    tracks.value = data as ITimeTrack[]
    tracks.value.forEach(async track => {
      const id = track.id
        const pauses = await getPausesOfTrack(track.id)
        if(pauses) {
          refreshPausesInStateTrack(pauses)
          refreshPausesInTracksOfTheWeek(id, pauses)
        }
    });
  }

  // computed properties
  // effectiveDuration calculated instead of filed form base
  const effectiveDuration = computed(() => {
    let efd:number = 0
    if(tracks.value) {
      tracks.value.forEach(track => {
        efd = efd + Number(track.Duration)
        track.pauses?.forEach(pause => {
          efd = efd - pause.Duration
        });
      })
    }
    return formatDuration(efd)
  })

    // methods
  // navigation to week
  const navToWeek = async (newWeek:number) => {
    selectedWeek.value = newWeek
    const data = await getTracksOfTheWeek(uid, selectedWeek.value)
    if(data) {
      tracks.value = data as ITimeTrack[]
      tracks.value.forEach(async track => {
          const pauses = await getPausesOfTrack(track.id)
          if(pauses) {
            refreshPausesInStateTrack(pauses)
            refreshPausesInTracksOfTheWeek(track.id, pauses)
          }
      });
    }
  }

  const closeTrack = (track:any) => {
    updateTrack(track)
  }

  // update track
  const updateTrack = (track:any) => {
    // alert(track.id + " was dropped on " + track.start.toISOString() + ', end:'+track.end)
    if(track.isTrack) {
      updateTimeTrack(track.id, track.start, track.end )
      .then((tt) => {
        if(tt.End) messageToSnack("Day closed at "+new Date(tt.End).toLocaleString())
        else messageToSnack("Day changed to "+new Date(tt.Start).toLocaleString())
      })
    } else {
      updatePauseTrack(track.id, track.start, track.end )
      .then((pt) => {
        if(pt) {
        if(pt.End) messageToSnack("Pause closed at "+new Date(pt.End).toLocaleString())
        else messageToSnack("Pause changed to "+new Date(pt.Start).toLocaleString())
        }
      })
    }
  }
  // delete track
  const deleteTrack = (track:any) => {
    if(track.isTrack) {
      deleteTimeTrack(track.id )
      .then(() => {
        messageToSnack("Day deleted")
      })
    } else {
      deleteStatePause(track.id)
      .then(() => {
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