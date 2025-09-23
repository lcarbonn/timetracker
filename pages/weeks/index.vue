<template>
    <div>
      <BCard>
        <DomainCalendarWeek :tracks="tracksWeek" @emit-filter="emitFilter"/>
      </BCard>
      <BCard :title="'Your tracks for week ' + useWeek().value">
        <DomainTimeTracksTable :tracks="tracksWeek" @delete-track="deleteDay" @emit-filter="emitFilter"/>
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

  const emitFilter = () => {
    if(user.value) getStateTimeTracksWeekUid(user.value.id, useWeek().value)
  }

</script>