<template>
    <div>
      <BCard :title="'Time Tracks for ' + user?.first_name" body-class="text-center">
        <BButton v-if="track && !track.End" class="m-3" @click="closeTrack">End track</BButton>
        <BButton v-else class="m-3" @click="openTrack">Start track</BButton>
        <BCardText v-if="track"> Track started at : {{ startDate }}</BCardText>
      </BCard>
      <BCard :title="'Your tracks for today ' + now.toLocaleDateString().substring(0,10)">
        <DomainTimeTracksTableToday :tracks="tracksToday" @delete-track="deleteTrack" @emit-filter="emitFilter"/>
      </BCard>
      <BCard :title="'Your tracks for week ' + currentWeek">
        <DomainTimeTracksTableWeek :tracks="tracksWeek" @delete-track="deleteTrack" @emit-filter="emitFilter"/>
      </BCard>
      <BModal v-model="modal" title="Delete track" @ok="confirmDelete"> Really ? </BModal>

    </div>
</template>

<script setup lang="ts">
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
  const track = useTimeTrack()
  const tracksWeek = useTimeTracksWeek()
  const tracksToday = useTimeTracksToday()

  // local refs
  const modal = ref(false)
  const track4Delete = ref()

  if(user.value) {
    // console.log("start user:", authUser?.value.user.user_id)
    getLastOpenTimeTrack(user.value.id)
    getStateTimeTracksWeekUid(user.value.id, useWeek().value)
    getStateTimeTracksTodayUid(user.value.id)
  }

  // computed properties
  const startDate = computed(() => {
    let text = ""
    if(track.value?.Start) {
      const start = new Date(track.value.Start)
      text = start.toLocaleDateString() +" - "+start.toLocaleTimeString()
    }
    return text
  })

  // methods
  const openTrack = () => {
    if(user.value) {
      openTimeTrack(user.value.id)
    }
  }

  const closeTrack = () => {
    if(track.value) closeTimeTrack(track.value.id)
  }

  // ask for modal before delete
  const deleteTrack = (track:ITimeTrack) => {
    track4Delete.value = track
    modal.value = !modal.value
  }
  // confirm delete received
  const confirmDelete = () => {
    if(track4Delete.value) deleteStateTrack(track4Delete.value.id)
    track4Delete.value = null
  }

  const emitFilter = () => {
    if(user.value) getStateTimeTracksWeekUid(user.value.id, useWeek().value)
  }

</script>