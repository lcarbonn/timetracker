<template>
    <div>
      <BCard :title="'Your week '+useWeek().value+' tracks for ' + user?.first_name" body-class="text-center">
      </BCard>
      <DomainCalendarWeek :tracks="tracksWeek" @nav-to-week="navToWeek" @update-track="updateTrack" @delete-track="deleteTrack"/>
      <!-- <BCard>
        <DomainTimeTracksTable :tracks="tracksWeek" @delete-track="deleteDay"/>
      </BCard>
      <BModal v-model="modalDeleteDay" title="Delete day" @ok="confirmDeleteDay"> Really ? </BModal>
      <BModal v-model="modalRestartDay" title="Restart day" @ok="confirmRestartDay"> Really ? </BModal> -->
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
  const tracksWeek = useTimeTracksWeek()
    
  if(user.value) {
    getStateTimeTracksWeekUid(useWeek().value)
  }

  const navToWeek = (week:number) => {
    useWeek().value = week
    if(user.value) getStateTimeTracksWeekUid(week)
  }

  const updateTrack = (track:any) => {
    // alert(track.id + " was dropped on " + track.start.toISOString() + ', end:'+track.end)
    if(track.isTrack) {
      updateTimeTrack(track.id, track.start, track.end )
      .then((tt) => {
        refreshStateTracksTime(tt)
        messageToSnack("Day changed to "+new Date(tt.Start).toLocaleString())
      })
    } else {
      updatePauseTrack(track.id, track.start, track.end )
      .then((pt) => {
        refreshStateTracksPause(pt)
        messageToSnack("Pause changed to "+new Date(pt.Start).toLocaleString())
      })
    }
  }
  const deleteTrack = (track:any) => {
    if(track.isTrack) {
      deleteStateTrack(track.id )
      .then((tt) => {
        deleteFromStateTracksTime(track.id)
        messageToSnack("Day deleted")
      })
    } else {
      deleteStatePause(track.id)
      .then((pt) => {
        deleteFromStateTracksPause(track.id)
        messageToSnack("Pause deleted")
      })
    }
  }

</script>