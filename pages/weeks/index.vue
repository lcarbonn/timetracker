<template>
    <div>
      <BCard :title="'Your week '+week+' calendar for ' + user?.first_name" body-class="text-center">
        <BCardText>
          Effective Duration : <b>{{ effectiveDuration }}</b>
        </BCardText>
      </BCard>
      <DomainCalendar v-if="tracks" :currentWeek="week" :tracks="tracks" @nav-to-week="navToWeek" @update-track="updateTrack" @delete-track="deleteTrack"/>
    </div>
</template>

<script setup lang="ts">

  // middleware
  definePageMeta({
    middleware: 'auth'
  })

  const { user } = useUserSession()

  // const
  const uid = user.value?.id
  const now = new Date()
  const currentWeek:number = getWeekNumber(now)
  const week =  ref(currentWeek)
  const tracks = useTimeTracksOfTheWeek()

  const { data, execute } = await useAsyncData('fetchTracks', () => getTracksOfTheWeek(uid, week.value),
  {
      watch:[week]
  })

  if(data.value) tracks.value = data.value as ITimeTrack[]
  
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
    week.value = newWeek
    await execute()
    if(data.value) tracks.value = data.value as ITimeTrack[]
  }

  // update track
  const updateTrack = (track:any) => {
    // alert(track.id + " was dropped on " + track.start.toISOString() + ', end:'+track.end)
    if(track.isTrack) {
      updateTimeTrack(track.id, track.start, track.end )
      .then((tt) => {
        if(tt) {
        refreshTimeInTracksOfTheWeek(tt)
        messageToSnack("Day changed to "+new Date(tt.Start).toLocaleString())
        }
      })
    } else {
      updatePauseTrack(track.id, track.start, track.end )
      .then((pt) => {
        if(pt) {
        refreshPauseInTimeTracksOfTheWeek(pt)
        messageToSnack("Pause changed to "+new Date(pt.Start).toLocaleString())
        }
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