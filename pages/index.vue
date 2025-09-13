<template>
    <div>
      <BCard :title="authUser?.user.first_name">
        <BButton v-if="track && !track.End" class="m-3" @click="closeTrack">Stop track</BButton>
        <BButton v-else class="m-3" variant="primary" @click="openTrack">Start track</BButton>
        <BCardText v-if="track"> Track started at : {{ startDate }}</BCardText>
      </BCard>
      <DomainTimeTracksTable :tracks="tracks" @delete-track="deleteTrack"/>
      <BModal v-model="modal" title="Delete track" @ok="confirmDelete"> Really ? </BModal>

    </div>
</template>

<script setup lang="ts">
import type { ITimeTrack } from '~/types/tableTimeTrack'


  // local refs
  const authUser = useAuthUser()
  const track = useTimeTrack()
  const tracks = useTimeTracks()

  // local refs
  const modal = ref(false)
  const track4Delete = ref()

  if(authUser.value?.user.user_id) {
    // console.log("start user:", authUser?.value.user.user_id)
    getLastOpenTimeTrack(authUser.value.user.user_id)
    getStateTimeTracksUid(authUser.value.user.user_id)
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
    if(authUser.value) {
      openTimeTrack(authUser.value.user.user_id)
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
    if(track4Delete.value) deleteStateTrack(track4Delete.value)
    track4Delete.value = null
  }

</script>