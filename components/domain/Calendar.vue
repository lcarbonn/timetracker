<template>
    <div>
      <FullCalendar  ref="fullCalendar" :options="calendarOptions"/>
      <LazyDomainModalUpdateTimeTrack
        v-if="selectedEvent"
        :modalUpdateTrack="modalUpdateTrack"
        :time-track="selectedEvent"
        :minDate="minDate"
        :maxDate="maxDate"
        @update-track="updateTrack"
        @delete-track="deleteTrack"
        @close-track="closeTrack"
        @create-track="createTrack"
        @add-pause="addPause"
        @restart-track="restartTrack"></LazyDomainModalUpdateTimeTrack>
    </div>
</template>

<script setup lang="ts">
  import FullCalendar from '@fullcalendar/vue3'
  import interactionPlugin from '@fullcalendar/interaction'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import type { CalendarOptions } from '@fullcalendar/core/index.js'

  // props
  const props = defineProps({
      isWeekGrid: {
        type: Boolean,
        default: false
      },
      tracks: {
          type: Array<TimeTrack>,
          default: undefined
      },
      selectedWeek: {
        type: Number,
        defaut: getWeekNumber(new Date())
      }
  })

  // emits declaration
  const emit = defineEmits(['navToWeek', 'updateTrack', 'closeTrack', 'deleteTrack', 'restartTrack', 'createTrack'])

  const fullCalendar = ref()
  const selectedEvent = ref()
  const todayWeek = getWeekNumber(new Date())
  const currentWeek = ref(props.selectedWeek?props.selectedWeek:todayWeek)
  const modalUpdateTrack = ref(new ModalShow()) 

  const minDate = ref()
  minDate.value = getMinDate(new Date())
  
  const maxDate = ref()
  maxDate.value = getMaxDate(new Date())
  const isToday = ref(true)

  const resetMinMaxDates = () => {
    const now = fullCalendar.value.getApi().getDate()
    minDate.value = getMinDate(now)
    maxDate.value = getMaxDate(now)
  }
  // set events
  const calendarEvents = computed (() => {
    const events:any[] = []
    props.tracks?.forEach(track => {
      // add the track to the calendar
      events.push( trackToEvent(track, !props.isWeekGrid))
      // add the pauses to the calendar
      let pi = 1
      const plentgth = track.pauses?.length
      track.pauses?.forEach(pause => {
        events.push( pauseToEvent(pause, (!props.isWeekGrid && (pi==plentgth))))
        pi++
      });        
    });
    return events
  })

  // calendar configuration
  const calendarOptions = computed(() => {
    const cal:CalendarOptions = {
      plugins: [timeGridPlugin, interactionPlugin],
      locale:"fr-fr",
      initialView: props.isWeekGrid?"timeGridWeek":"timeGridDay",
      editable: true,
      nowIndicator: true,
      scrollTime:"08:00:00",
      dayHeaders:props.isWeekGrid,
      stickyHeaderDates: true,
      allDaySlot:false,
      firstDay:1,
      snapDuration:"00:15:00",
      // dragScroll:false,
      // navLinks:true,
      events: calendarEvents.value,
      businessHours: {
        // days of week. an array of zero-based day of week integers (0=Sunday)
        daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday
        startTime: '07:00',
        endTime: '18:00',
      },
      headerToolbar: {
        left: props.isWeekGrid?"myPrevButton,myTodayButton,myNextButton": undefined,
        center: props.isWeekGrid?'addEventButton':"title",
        right: props.isWeekGrid?"timeGridWeek,timeGridDay":undefined,
      },
      customButtons: {
        myPrevButton: {
          icon: 'chevron-left',
          click: function() {
            currentWeek.value = currentWeek.value-1
            fullCalendar.value.getApi().prev()
            resetMinMaxDates()
            isToday.value = false
            emit('navToWeek', currentWeek.value)
          }
        },
        myTodayButton: {
          text: 'today',
          click: function() {
            currentWeek.value = todayWeek
            fullCalendar.value.getApi().today()
            resetMinMaxDates()
            isToday.value = true
            emit('navToWeek', currentWeek.value)
          }
        },
        myNextButton: {
          icon: 'chevron-right',
          click: function() {
            currentWeek.value = currentWeek.value+1
            fullCalendar.value.getApi().next()
            resetMinMaxDates()
            isToday.value = false
            emit('navToWeek', currentWeek.value)
          }
        },
        addEventButton: {
          text: 'Add day',
          click: function() {
            selectedEvent.value = newTrackToEvent(!isToday.value?minDate.value:null)
            modalUpdateTrack.value.show = !modalUpdateTrack.value.show
          }
        },
      },    
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
    // alert(info.event.title + " was dropped on " + info.event.start?.toISOString() + ', isEnded' + info.event.extendedProps.isEnded);
    selectedEvent.value = info.event
    modalUpdateTrack.value.show = !modalUpdateTrack.value.show
  }

  const createTrack = (start:Date, end:Date) => {
    const track = {
      start:start,
      end:end,
      isTrack:selectedEvent.value.extendedProps.isTrack,
      timeId:selectedEvent.value.extendedProps.timeId
    }
    emit('createTrack', track)
  }

  const addPause = () => {
    const track  = selectedEvent.value
    const pause = newPauseToEvent(track.id, track.start, track.end)
    selectedEvent.value = pause
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
  const restartTrack = (id:string, start:Date, end:Date) => {
    const track = {
      id:id,
      start:start,
      end:selectedEvent.value.extendedProps.isEnded?end:null,
      isTrack:selectedEvent.value.extendedProps.isTrack
    }
    emit('restartTrack', track)
  }
  const closeTrack = (id:string, start:Date, end:Date) => {
    const track = {
      id:id,
      start:start,
      end:end,
      isTrack:selectedEvent.value.extendedProps.isTrack
    }
    emit('closeTrack', track)
  }
  const deleteTrack = (id:string) => {
    const track = {
      id:id,
      isTrack:selectedEvent.value.extendedProps.isTrack
    }
    emit('deleteTrack', track)
  }

</script>