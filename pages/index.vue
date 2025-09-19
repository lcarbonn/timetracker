<template>
    <div>
      <BCard :title="'Time Tracks for ' + user?.first_name" body-class="text-center">
        <BButton v-if="track && !track.End" size="lg" class="mx-1" @click="closeTrack">End track</BButton>
        <BButton v-else size="lg" class="m-1" @click="openTrack">Start track</BButton>
        <BCardText v-if="track"> Track started at : <b>{{ startDate }}</b></BCardText>
        <BCardText v-if="track"> Timer : <b>{{ timer }}</b></BCardText>
      </BCard>
      <BCard :title="'Your tracks for today ' + now.toLocaleDateString().substring(0,10)">
        <DomainTimeTracksTableToday :tracks="tracksToday" @delete-track="deleteTrack" @reopen-track="reopenTrack"/>
      </BCard>
      <BCard :title="'Your tracks for week ' + currentWeek">
        <DomainTimeTracksTableWeek :tracks="tracksWeek" @delete-track="deleteTrack" @emit-filter="emitFilter"/>
      </BCard>
      <BModal v-model="modalDelete" title="Delete track" @ok="confirmDelete"> Really ? </BModal>
      <BModal v-model="modalRestart" title="Restart track" @ok="confirmRestart"> Really ? </BModal>

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
  const track = useTimeTrack()
  const tracksWeek = useTimeTracksWeek()
  const tracksToday = useTimeTracksToday()

  // local refs
  const modalDelete = ref(false)
  const modalRestart = ref(false)
  const selectedTrack = ref()

  if(user.value) {
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
      startChrono()
    }
    return text
  })

  const timer = ref()
  const chrono = ref()
  
  const startChrono = () => {
      chrono.value = setInterval(() => {
        getChrono()
      }, 1000);
  }

  // methods
  const getChrono = ()  => {
    const thousand = 1000;
    const sixty = 60;
    const twentyfour = 24;    
    let duration:string
    if(track.value?.Start) {
      const start = new Date(track.value.Start)
      const now = new Date()
      const t = now.getTime()-start.getTime()
      const days = Math.floor(t / (thousand * sixty * sixty * twentyfour));
      const hours = Math.floor((t % (thousand * sixty * sixty * twentyfour)) / (thousand * sixty * sixty));
      const minutes = Math.floor((t % (thousand * sixty * sixty)) / (thousand * sixty));
      const seconds = Math.floor((t % (thousand * sixty)) / thousand);
      duration = days +"d:"+hours+"h:"+minutes+"m:"+seconds+"s"
      timer.value = duration
    }
  }

  const openTrack = () => {
    if(user.value) {
      openTimeTrack(user.value.id)
    }
  }

  const closeTrack = () => {
    if(track.value) closeTimeTrack(track.value.id)
    clearInterval(chrono.value)
  }

  // ask for modal before delete
  const deleteTrack = (track:ITimeTrack) => {
    selectedTrack.value = track
    modalDelete.value = !modalDelete.value
  }
  // confirm delete received
  const confirmDelete = () => {
    if(selectedTrack.value) deleteStateTrack(selectedTrack.value.id)
    selectedTrack.value = null
  }

  // reopen track
  const reopenTrack = (track:ITimeTrack) => {
    selectedTrack.value = track
    modalRestart.value = !modalDelete.value
  }
  // confirm restart received
  const confirmRestart = () => {
    if(selectedTrack.value) reopenTimeTrack(selectedTrack.value.id)
  }

  const emitFilter = () => {
    if(user.value) getStateTimeTracksWeekUid(user.value.id, useWeek().value)
  }

</script>