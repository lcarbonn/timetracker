<template>
    <div>
      <BCard :title="authUser?.user.first_name">
        <BButton v-if="track && !track.End" class="m-3" variant="primary" @click="closeTrack">Stop track</BButton>
        <BButton v-else class="m-3" variant="primary" @click="openTrack">Start track</BButton>
        <BCardText v-if="track"> Start : {{ startDate }}</BCardText>
      </BCard>
      <DomainTimeTracksTable :tracks="tracks"/>
    </div>
</template>

<script setup lang="ts">

  // local refs
  const authUser = useAuthUser()
  const track = useTimeTrack()
  const tracks = useTimeTracks()

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
      openTimeTrack(authUser.value?.user.user_id)
    }
  }

  const closeTrack = () => {
    if(track.value) closeTimeTrack(track.value.id)
  }

</script>