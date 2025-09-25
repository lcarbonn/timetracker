<template>
    <div>
      <BCard :title="'Your week '+useWeek().value+' tracks for ' + user?.first_name" body-class="text-center">
      </BCard>
      <DomainCalendarWeek :tracks="tracksWeek" @nav-to-week="navToWeek" @update-track="updateTrack" @delete-track="deleteTrack"/>
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
    
  if(user.value) {
    getStateTimeTracksOfTheWeek(useWeek().value)
  }

  const navToWeek = (week:number) => {
    useWeek().value = week
    if(user.value) getStateTimeTracksOfTheWeek(week)
  }

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