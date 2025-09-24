<template>
    <div>
      <FullCalendar ref="fullCalendar":options="calendarOptions" />
      <LazyDomainUpdateTimeTrack v-if="selectedEvent" :modalUpdateTrack="modalUpdateTrack" :time-track="selectedEvent" @update-time-track="updateTimeTrack"></LazyDomainUpdateTimeTrack>
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
  const emit = defineEmits(['navToWeek', 'updateTrack'])

  const fullCalendar = ref()
  const selectedEvent = ref()
  const todayWeek = useWeek().value
  const currentWeek = useWeek()
  const modalUpdateTrack = ref(new ModalShow()) 

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
    if(props.tracks && props.tracks.length>0) {
      props.tracks.forEach(track => {
        events.push( {
          title: track.End?"Day of effective "+formatDuration(track.EffectiveDuration):"Day not yet completed",
          start:track.Start,
          end:track.End?track.End:new Date(),
          // end:track.End,
          color:'#378006',
          id:track.id
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
      editable: true,
      nowIndicator: true,
      scrollTime:"07:00:00",
      stickyHeaderDates: true,
      allDaySlot:false,
      firstDay:1,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday
        startTime: '07:00', // a start time (10am in this example)
        endTime: '18:00', // an end time (6pm in this example)
      },
      customButtons: {
        myPrevButton: {
          icon: 'chevron-left',
          click: function() {
            currentWeek.value = currentWeek.value-1
            fullCalendar.value.getApi().prev()
            emit('navToWeek', currentWeek.value)
          }
        },
        myTodayButton: {
          text: 'today',
          click: function() {
            currentWeek.value = todayWeek
            fullCalendar.value.getApi().today()
            emit('navToWeek', currentWeek.value)
          }
        },
        myNextButton: {
          icon: 'chevron-right',
          click: function() {
            currentWeek.value = currentWeek.value+1
            fullCalendar.value.getApi().next()
            emit('navToWeek')
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
      snapDuration:"00:15:00",
      dragScroll:false,
      eventDrop(info) {
        dropResizeEvent(info)
      },
      eventResize(info) {
        dropResizeEvent(info)
      },
      eventClick(info) {
        clickEvent(info)
      },
    };
  return cal
  })

  // methods
  // drop and resize event
  const dropResizeEvent = (info:any) => {
    // alert(info.event.title + " was dropped on " + info.event.start?.toISOString() + ', end:'+info.event.end?.toISOString());
    const track = {
      id:info.event.id,
      start:info.event.start,
      end:info.event.end
    }
    emit('updateTrack', track)
  }
  // click on event
  const clickEvent = (info:any) => {
    // alert(info.event.title + " was dropped on " + info.event.start?.toISOString() + ', end:'+info.event.end?.toISOString());
    selectedEvent.value = info.event
    modalUpdateTrack.value.show = !modalUpdateTrack.value.show
  }
  const updateTimeTrack = (id:string, start:Date, end:Date) => {
    const track = {
      id:id,
      start:start,
      end:end
    }
    emit('updateTrack', track)
  }

</script>