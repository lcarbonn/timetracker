<template>
    <FullCalendar :options="calendarOptions"/>
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

  // computed events
  const calendarEvents = computed (() => {
    const events:any[] = []
    const today = props.todayTrack
    if(today) {
      events.push( {
        title: today.End?"Day "+formatDuration(today.Duration):"Day started",
        start:today.Start,
        end:today.End?today.End:new Date(),
        color:'#378006'
        // url: "https://ui-thing.behonbaker.com/",
      })
    }
    if(props.todayPauses) {
      props.todayPauses.forEach(pause => {
        events.push( {
          title: pause.End?"Pause of "+formatDuration(pause.Duration):"Pause started",
          start:pause.Start,
          end:pause.End?pause.End:new Date()
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
      // editable: true,
      nowIndicator: true,
      scrollTime:"07:00:00",
      dayHeaders:false,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday

        startTime: '07:00', // a start time (10am in this example)
        endTime: '18:00', // an end time (6pm in this example)
      },
      // dateClick(arg) {
      //   useSonner("Date clicked", {
      //     description: dayjs(arg.dateStr).format("dddd, MMMM D, YYYY h:mm A"),
      //   });
      // },
      // eventClick(arg) {
      //   useSonner("Event clicked", {
      //     description: arg.event.title,
      //   });
      // },
      stickyHeaderDates: true,
      allDaySlot:false,
      headerToolbar: {
        left: "",
        center: "title",
        right: "",
      },
      // footerToolbar: {
      //   left: "prevYear,prev,today,next,nextYear",
      //   center: "",
      //   right: "timeGridWeek,timeGridDay",
      // },
      events: calendarEvents.value,
    };
  return cal
  })

</script>