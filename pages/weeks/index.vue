<template>
    <div>
      <BCard :title="'Your week '+useWeek().value+' tracks for ' + user?.first_name" body-class="text-center">
      </BCard>
      <DomainCalendarWeek :tracks="tracksWeek" @nav-to-week="navToWeek" @update-track="updateTrack"/>
      <BCard>
        <DomainTimeTracksTable :tracks="tracksWeek" @delete-track="deleteDay"/>
      </BCard>
      <BModal v-model="modalDeleteDay" title="Delete day" @ok="confirmDeleteDay"> Really ? </BModal>
      <BModal v-model="modalRestartDay" title="Restart day" @ok="confirmRestartDay"> Really ? </BModal>
    </div>
</template>

<script setup lang="ts">
import { reopenTimeTrack } from '~/composables/useTimeTrack'
import type { ITimeTrack } from '~/types/tableTimeTrack'

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
  
  // local refs
  const modalDeleteDay = ref(false)
  const modalRestartDay = ref(false)
  const selectedTrack = ref()
  
  if(user.value) {
    getStateTimeTracksWeekUid(user.value.id, useWeek().value)
  }

  // ask for modal before delete
  const deleteDay = (track:ITimeTrack) => {
    selectedTrack.value = track
    modalDeleteDay.value = !modalDeleteDay.value
  }
  // confirm delete received
  const confirmDeleteDay = () => {
    if(selectedTrack.value) deleteStateTrack(selectedTrack.value.id)
    selectedTrack.value = null
  }

  // confirm restart received
  const confirmRestartDay = () => {
    if(selectedTrack.value) reopenTimeTrack(selectedTrack.value.id)
  }

  const navToWeek = (week:number) => {
    useWeek().value = week
    if(user.value) getStateTimeTracksWeekUid(user.value.id, week)
  }

  const updateTrack = (track:any) => {
    // get the original end time of the track
    useTimeTracksWeek().value.forEach(tt => {
      if(tt.id==track.id) {
        if(!tt.End) track.end = null
      }
    });
    if(track) updateTimeTrack(track.id, track.start, track.end )
  }

</script>