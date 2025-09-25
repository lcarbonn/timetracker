<template>
    <FullCalendar :options="calendarOptions"/>
    <LazyDomainModalUpdateTimeTrack v-if="selectedEvent" :modalUpdateTrack="modalUpdateTrack" :time-track="selectedEvent" @update-track="updateTrack"></LazyDomainModalUpdateTimeTrack>

</template>

<script setup lang="ts">
  import FullCalendar from '@fullcalendar/vue3'
  import interactionPlugin from '@fullcalendar/interaction'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import type { CalendarOptions } from '@fullcalendar/core/index.js'
  import type { IPauseTrack } from '~/types/tablePauseTrack'
  import { TimeTrack } from '~/types/tableTimeTrack'

  // props
  const props = defineProps({
      todayTrack: {
          type: TimeTrack,
          default: undefined
      },
      todayPauses: {
          type: Array<IPauseTrack>,
          default: undefined
      },
  })

    // emits declaration
  const emit = defineEmits(['updateTrack'])

  const selectedEvent = ref()
  const modalUpdateTrack = ref(new ModalShow()) 

  // computed events
  const calendarEvents = computed (() => {
    const events:any[] = []
    const today = props.todayTrack
    if(today) {
      events.push( {
        title: today.End?"Day "+formatDuration(today.Duration):"Day started",
        start:today.Start,
        end:today.End?today.End:new Date(),
        color:'#378006',
        id:today.id,
        isTrack:true,
        isEnded:today.End?true:false
      })
    }
    if(props.todayPauses) {
      props.todayPauses.forEach(pause => {
        events.push( {
          title: pause.End?"Pause of "+formatDuration(pause.Duration):"Pause started",
          start:pause.Start,
          end:pause.End?pause.End:new Date(),
          id:pause.id,
          isTrack:false,
          isEnded:pause.End?true:false
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
      initialView: "timeGridDay",
      editable: true,
      nowIndicator: true,
      scrollTime:"07:00:00",
      dayHeaders:false,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday

        startTime: '07:00', // a start time (10am in this example)
        endTime: '18:00', // an end time (6pm in this example)
      },
      stickyHeaderDates: true,
      allDaySlot:false,
      headerToolbar: {
        left: "",
        center: "title",
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

</script>