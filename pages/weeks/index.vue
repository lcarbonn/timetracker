<template>
    <div>
      <BCard :title="'Your week '+selectedWeek+' calendar for ' + user?.first_name" body-class="text-center">
        <BCardText>
          Effective Duration : <b>{{ effectiveDuration }}</b>
        </BCardText>
      </BCard>
      <DomainCalendar v-if="tracks" :selectedWeek="selectedWeek" :tracks="tracks" @nav-to-week="navToWeek" @update-track="updateTrack" @delete-track="deleteTrack"/>
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
  const { data, execute:reloadTracks } = await useAsyncData('fetchTracks', () => getTracksOfTheWeek(uid, selectedWeek.value),
  {
      watch:[selectedWeek]
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
    selectedWeek.value = newWeek
    await reloadTracks()
    if(data.value) tracks.value = data.value as ITimeTrack[]
  }

  // update track
  const updateTrack = (track:any) => {
    // alert(track.id + " was dropped on " + track.start.toISOString() + ', end:'+track.end)
    if(track.isTrack) {
      updateTimeTrack(track.id, track.start, track.end )
      .then((tt) => {
        refreshTrackInTracksOfTheWeek(tt)
        messageToSnack("Day changed to "+new Date(tt.Start).toLocaleString())
      })
    } else {
      updatePauseTrack(track.id, track.start, track.end )
      .then((pt) => {
        if(pt) {
        // refreshPauseInTracksOfTheWeek(pt)
        messageToSnack("Pause changed to "+new Date(pt.Start).toLocaleString())
        }
      })
    }
  }
  // delete track
  const deleteTrack = (track:any) => {
    if(track.isTrack) {
      deleteTimeTrack(track.id )
      .then(() => {
        deleteTrackFromTracksOfTheWeek(track.id)
        messageToSnack("Day deleted")
      })
    } else {
      deleteStatePause(track.id)
      .then(() => {
        // deletePauseFromTracksOfTheWeek(track.id)
        messageToSnack("Pause deleted")
      })
    }
  }

</script>