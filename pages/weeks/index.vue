<template>
    <div>
      <BCard :title="'Your week '+useWeek().value+' tracks for ' + user?.first_name" body-class="text-center">
        <BCardText>
          Effective Duration : <b>{{ effectiveDuration }}</b>
        </BCardText>
      </BCard>
      <DomainCalendar :tracks="tracksWeek" @nav-to-week="navToWeek" @update-track="updateTrack" @delete-track="deleteTrack"/>
    </div>
</template>

<script setup lang="ts">

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
  const tracksWeek = useTimeTracksOfTheWeek()

  // init on setup
  getStateTimeTracksOfTheWeek(useWeek().value)

  // computed properties
  // effectiveDuration calculated instead of filed form base
  const effectiveDuration = computed(() => {
    let efd:number = 0
    if(tracksWeek.value) {
      tracksWeek.value.forEach(track => {
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
  const navToWeek = (week:number) => {
    useWeek().value = week
    getStateTimeTracksOfTheWeek(week)
  }

  // update track
  const updateTrack = (track:any) => {
    // alert(track.id + " was dropped on " + track.start.toISOString() + ', end:'+track.end)
    if(track.isTrack) {
      updateTimeTrack(track.id, track.start, track.end )
      .then((tt) => {
        refreshTimeInTracksOfTheWeek(tt)
        messageToSnack("Day changed to "+new Date(tt.Start).toLocaleString())
      })
    } else {
      updatePauseTrack(track.id, track.start, track.end )
      .then((pt) => {
        refreshPauseInTimeTracksOfTheWeek(pt)
        messageToSnack("Pause changed to "+new Date(pt.Start).toLocaleString())
      })
    }
  }
  // delete track
  const deleteTrack = (track:any) => {
    if(track.isTrack) {
      deleteStateTrack(track.id )
      .then((tt) => {
        deleteTimeFromTimeTracksOfTheWeek(track.id)
        messageToSnack("Day deleted")
      })
    } else {
      deleteStatePause(track.id)
      .then((pt) => {
        deletePauseFromTimeTracksOfTheWeek(track.id)
        messageToSnack("Pause deleted")
      })
    }
  }

</script>