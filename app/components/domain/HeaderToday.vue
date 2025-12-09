<template>
  <UPageCard :title="'Today track for ' + user?.first_name">
    <template #footer>
      <USeparator label="Track"/>
      <UButton v-if="!todayTrack" @click="emit('startDay')">Start my day</UButton>
      <UButton v-if="todayTrack && !todayTrack.End" @click="endDay">End my day</UButton>
      <UButton v-if="todayTrack && todayTrack.End" @click="emit('restartDay')">Restart my day</UButton>
      <p v-if="todayTrack && !todayTrack.End"> Day started at : <b>{{ todayStartTime }}</b></p>
      <p v-if="todayTrack && todayTrack.End">  Day started at : <b>{{ todayStartTime }}</b> - ended at : <b>{{ todayEndTime }}</b></p>
      <p v-if="todayTrack && todayTrack.End">
        Duration : <b>{{ formatDuration(todayTrack.Duration) }}</b> 
        - Pause Duration : <b>{{ formatDuration(todayTrack.PauseDuration) }}</b> 
        - Effective Duration : <b>{{ formatDuration(todayTrack.EffectiveDuration) }}</b>
      </p>
      <p v-if="todayTrack && !todayTrack.End"> Timer : <b>{{ dayTimer }}</b></p>
      <USeparator label="Pause" v-if="todayTrack && !todayTrack.End"/>
      <UButton v-if="todayTrack && !todayTrack.End && !currentPause" @click="emit('startPause')">Have a break</UButton>
      <UButton v-if="todayTrack && currentPause && !currentPause.End" @click="emit('endPause')">Back to work</UButton>
      <p v-if="currentPause && !currentPause.End">  Pause started at : <b>{{ currentPauseStartTime }}</b></p>
      <p v-if="currentPause && !currentPause.End"> Duration : <b>{{ pauseTimer }}</b></p>
    </template>
  </UPageCard>
</template>
<script setup lang="ts">
    // props
  const props = defineProps<{
      todayTrack?: ITimeTrack;
      currentPause?: IPauseTrack;
    }>()

  // emits declaration
  const emit = defineEmits<{
    startDay: [];
    endDay: [];
    startPause: [];
    endPause: [];
    restartDay:[]
  }>()

  const { user } = useUserSession()

  // start time of the day
  const todayStartTime = computed(() => {
    let text = ""
    if(props.todayTrack?.Start) {
      const start = new Date(props.todayTrack.Start)
      text = start.toLocaleDateString() +" - "+start.toLocaleTimeString()
    }
    return text
  })

  // end time of the day
  const todayEndTime = computed(() => {
    let text = ""
    if(props.todayTrack?.End) {
      const end = new Date(props.todayTrack.End)
      text = end.toLocaleDateString() +" - "+end.toLocaleTimeString()
    }
    return text
  })

  // start time of the current pause
  const currentPauseStartTime = computed(() => {
    let text = ""
    if(props.currentPause?.Start) {
      const start = new Date(props.currentPause.Start)
      text = start.toLocaleDateString() +" - "+start.toLocaleTimeString()
    }
    return text
  })

  const dayTimer = ref()
  const dayChrono = ref()
  
  const pauseTimer = ref()
  const pauseChrono = ref()

  // managing timer only on client side
  onNuxtReady(async () => {
    const startPauseChrono = () => {
      pauseChrono.value = setInterval(() => {
        if(props.currentPause?.Start)
          pauseTimer.value = formatTimer(new Date(props.currentPause.Start))
        }, 1000);
    }
    const startDayChrono = () => {
      dayChrono.value = setInterval(() => {
        if(props.todayTrack?.Start)
          dayTimer.value = formatTimer(new Date(props.todayTrack.Start))
        }, 1000);
    }
    // start at init if track not ended
    if(!props.todayTrack?.End) {
      startDayChrono()
    }
    // watch track changes
    watch(() => props.todayTrack, (newValue, oldValue) => {
      if(!newValue?.End) {
        startDayChrono()
      }
    })
    // start at init if pause not ended
    if(!props.currentPause?.End) {
      startPauseChrono()
    }
    // watch pause changes
    watch(() => props.currentPause, (newValue, oldValue) => {
      if(!newValue?.End) {
        startPauseChrono()
      }
    })
  })

  const endDay = () => {
    emit('endDay')
    clearInterval(dayChrono.value)
  }
  const endPause = () => {
    emit('endPause')
    clearInterval(pauseChrono.value)
  }
</script>