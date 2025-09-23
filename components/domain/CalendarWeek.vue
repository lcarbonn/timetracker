<template>
    <div>
      <FullCalendar ref="fullCalendar":options="calendarOptions" />
    </div>
</template>

<script setup lang="ts">
  import FullCalendar from '@fullcalendar/vue3'
  import interactionPlugin from '@fullcalendar/interaction'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import type { CalendarOptions } from '@fullcalendar/core/index.js'
  import { TimeTrack } from '~/types/tableTimeTrack'

  // props
  const props = defineProps({
      tracks: {
          type: Array<TimeTrack>,
          default: undefined
      },
  })

  // emits declaration
  const emit = defineEmits(['emitFilter'])

  const fullCalendar = ref()
  const todayWeek = useWeek().value
  const currentWeek = useWeek()

  // watch changes date to go to associated calendar week
  watch(() => props.tracks, async(newTracks) => {
    if(newTracks) {
        if(newTracks.length>0) {
          fullCalendar.value.getApi().gotoDate(newTracks[0].Start)
        }
      }
    }
  )
  // set events
  const calendarEvents = computed (() => {
    const events:any[] = []
    if(props.tracks) {
      props.tracks.forEach(track => {
        events.push( {
          title: track.End?"Day of effective "+formatDuration(track.EffectiveDuration):"Day not yet completed",
          start:track.Start,
          end:track.End?track.End:new Date(),
          color:'#378006'
          // url: "https://ui-thing.behonbaker.com/",
        })
      });
    }
    return events
  })

  // calendar configuration
  const calendarOptions = computed(() => {
    const cal:CalendarOptions = {
      plugins: [timeGridPlugin, interactionPlugin],
      locale:"fr-fr",
      // editable: true,
      nowIndicator: true,
      scrollTime:"07:00:00",
      stickyHeaderDates: true,
      allDaySlot:false,

      customButtons: {
        myPrevButton: {
          icon: 'chevron-left',
          click: function() {
            currentWeek.value = currentWeek.value-1
            fullCalendar.value.getApi().prev()
            emit('emitFilter')
          }
        },
        myTodayButton: {
          text: 'today',
          click: function() {
            currentWeek.value = todayWeek
            fullCalendar.value.getApi().today()
            emit('emitFilter')
          }
        },
        myNextButton: {
          icon: 'chevron-right',
          click: function() {
            currentWeek.value = currentWeek.value+1
            fullCalendar.value.getApi().next()
            emit('emitFilter')
          }
        }
      },    
      headerToolbar: {
        left: "myPrevButton,myTodayButton,myNextButton",
        center: "",
        right: "",
      },
      footerToolbar: {
        left: "myPrevButton,myTodayButton,myNextButton",
        center: "",
        right: "",
      },
      events: calendarEvents.value,
    };
  return cal
  })

</script>