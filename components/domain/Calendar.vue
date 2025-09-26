<template>
    <div>
      <FullCalendar ref="fullCalendar":options="calendarOptions" />
      <LazyDomainModalUpdateTimeTrack 
        v-if="selectedEvent" 
        :modalUpdateTrack="modalUpdateTrack"
        :time-track="selectedEvent" 
        @update-track="updateTrack" 
        @delete-track="deleteTrack"></LazyDomainModalUpdateTimeTrack>
    </div>
</template>

<script setup lang="ts">
  import FullCalendar from '@fullcalendar/vue3'
  import interactionPlugin from '@fullcalendar/interaction'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import type { CalendarOptions } from '@fullcalendar/core/index.js'

  // props
  const props = defineProps({
      tracks: {
          type: Array<TimeTrack>,
          default: undefined
      },
      todayTrack: {
          type: TimeTrack,
          default: undefined
      },
  })

  // emits declaration
  const emit = defineEmits(['navToWeek', 'updateTrack', 'deleteTrack'])

  const fullCalendar = ref()
  const selectedEvent = ref()
  const todayWeek = useWeek().value
  const currentWeek = useWeek()
  const modalUpdateTrack = ref(new ModalShow()) 

  // watch changes date to go to associated calendar week
  watch(() => props.tracks, async(newTracks) => {
    if(newTracks) {
      fullCalendar.value.getApi().changeView("timeGridWeek")
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
        // add the track to the calendar
        events.push( trackToEvent(track))
        // add the pauses to the calendar
        track.pauses?.forEach(pause => {
          events.push( pauseToEvent(pause))
        });        
      });
    }
    const today = props.todayTrack
    if(today) {
      events.push( trackToEvent(today))
      today.pauses?.forEach(pause => {
        events.push( pauseToEvent(pause))
      });
    }
    return events
  })

  // calendar configuration
  const calendarOptions = computed(() => {
    const cal:CalendarOptions = {
      plugins: [timeGridPlugin, interactionPlugin],
      locale:"fr-fr",
      initialView: "timeGridDay",
      editable: true,
      nowIndicator: true,
      scrollTime:"07:00:00",
      dayHeaders:props.todayTrack?false:true,
      stickyHeaderDates: true,
      allDaySlot:false,
      firstDay:1,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday
        startTime: '07:00', // a start time (10am in this example)
        endTime: '18:00', // an end time (6pm in this example)
      },
      headerToolbar: {
        left: props.todayTrack?"":"myPrevButton,myTodayButton,myNextButton",
        center: props.todayTrack?"title":"",
        right: "",
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
            emit('navToWeek', currentWeek.value)
          }
        }
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
    selectedEvent.value = info.event
    updateTrack(info.event.id, info.event.start, info.event.end)
  }
  // click on event
  const clickEvent = (info:any) => {
    // alert(info.event.title + " was dropped on " + info.event.start?.toISOString() + ', isTrack:'+info.event.extendedProps.track);
    selectedEvent.value = info.event
    modalUpdateTrack.value.show = !modalUpdateTrack.value.show
  }
  const updateTrack = (id:string, start:Date, end:Date) => {
    const track = {
      id:id,
      start:start,
      end:selectedEvent.value.extendedProps.isEnded?end:null,
      isTrack:selectedEvent.value.extendedProps.isTrack
    }
    emit('updateTrack', track)
  }
  const deleteTrack = (id:string) => {
    const track = {
      id:id,
      isTrack:selectedEvent.value.extendedProps.isTrack
    }
    emit('deleteTrack', track)
  }

</script>