import type { ITimeTrack } from "~/types/tableTimeTrack"

/**
 * get time tracks for the user and the week and set state
 * @param user_id
 * @param week
 */
export const getStateTimeTracksWeekUid = (user_id:number, week:number) => {
  $fetch<ITimeTrack[]>('/api/timetracks', {
    method: 'GET',
      params: {
          week:week,
      }
  })
  .then((list) => {
      list.forEach(track => {
        getStateTrackPauseTracks(track)
        .then(() => {
          const tracks = useTimeTracksWeek().value
          const index = tracks.indexOf(track)
          tracks[index] = Object.assign([], track)
          // useTimeTracksWeek().value = Object.assign([], tracks)
        })
      })
      useTimeTracksWeek().value = list
  })
}

/**
 * get time tracks for the user for today and set state
 * @param user_id
 */
export const getStateTimeTracksTodayUid = (user_id:number) => {
  $fetch<ITimeTrack[]>('/api/timetracks', {
    method: 'GET',
      params: {
          today:true,
      }
  })
  .then((list) => {
      useTimeTracksToday().value = list
  })
}

// /**
//  * Get the last open time track for the user
//  * @param user_id
//  */
// export const getLastOpenTimeTrack = (user_id:number) => {
//   $fetch<ITimeTrack>('/api/lasttrack', {
//     method: 'GET',
//     params:{
//       user_id:user_id
//     }
//   })
//   .then((tt) => {
//       useTimeTrack().value = tt
//   })
// }

/**
 * Get the today time track for the user
 * @param user_id
 */
export const getStateTodayTimeTrack = (user_id:number) => {
  $fetch<ITimeTrack>('/api/todaytrack', {
    method: 'GET',
    params:{
      user_id:user_id
    }
  })
  .then((tt) => {
      useTimeTrack().value = tt
      if(tt) {
        getStatePauseTracks(tt.id)
      } else {
        usePauseTracks().value = undefined
      }
  })
}

/**
 * Open a new time track for the user
 * @param user_id
 */
export const openTimeTrack = (user_id:number) => {
  const { user } = useUserSession()
    $fetch<ITimeTrack>('/api/timetrack', {
        method: 'POST',
        body: {
          "UID":[
            {"id":user_id}
          ],
          "Start": new Date()
        }
    })
    .then ((tt) => {
      useTimeTrack().value = tt
      
      if(user.value) {
        getStateTimeTracksWeekUid(user.value.id, useWeek().value)
      }
    })
    .catch((error) => {
        useTimeTrack().value = undefined
    })
}

/**
 * Close the time track
 * @param id, the time track id
 */
export const closeTimeTrack = (id:number) => {
  const { user } = useUserSession()
  $fetch<ITimeTrack>('/api/timetrack', {
      method: 'PATCH',
      body: {
          id:id,
          End:new Date()
      }
  })
  .then ((tt) => {
      useTimeTrack().value = tt
      if(user.value) {
        getStateTimeTracksWeekUid(user.value.id, useWeek().value)
      }
  })
  .catch((error) => {
    useTimeTrack().value = undefined
  })
}

/**
 * Reopenthe time track
 * @param id, the time track id
 */
export const reopenTimeTrack = (id:number) => {
  const { user } = useUserSession()
  $fetch<ITimeTrack>('/api/timetrack', {
      method: 'PATCH',
      body: {
          id:id,
          End:null
      }
  })
  .then ((tt) => {
    useTimeTrack().value = tt
      if(user.value) {
        getStateTimeTracksWeekUid(user.value.id, useWeek().value)
      }
  })
  .catch((error) => {
    useTimeTrack().value = undefined
  })
}

/**
 * Delete the time track
 * @param id, the time track id
 */
export const deleteStateTrack = (id:number) => {
  const { user } = useUserSession()
  $fetch<ITimeTrack>('/api/timetrack', {
    method: 'DELETE',
    params:{
      id:id
    }
  })
  .then((tt) => {
      if(user.value) {
        getStateTimeTracksWeekUid(user.value.id, useWeek().value)
      }
  })
  if(useTimeTrack().value?.id == id) {
    useTimeTrack().value = undefined
  }
}

/**
 * Update the time track
 * @param id, the time track id
 * @param start, the start date
 * @param end, the end date
 */
export const updateTimeTrack = (id:number, start:Date, end:Date) : Promise<ITimeTrack>=> {
  return new Promise((resolve, reject) => {
    $fetch<ITimeTrack>('/api/timetrack', {
        method: 'PATCH',
        body: {
            id:id,
            Start:start,
            End:end
        }
    })
    .then ((tt) => {
      useTimeTrack().value = tt
      resolve(tt)
    })
    .catch((error) => {
      useTimeTrack().value = undefined
      reject(error)
    })
  })
}
/**
 * Refresh the state of tracks with the track
 * @param track, the track to refresh
 */
export const refreshStateTracksTime = (track:ITimeTrack) => {
    const tracks = useTimeTracksWeek().value
    for (let index = 0; index < tracks.length; index++) {
      const stateTrack = tracks[index];
      if(stateTrack.id == track.id) {
        track.pauses = stateTrack.pauses
        tracks[index] = Object.assign([], track)
      }
    }
}
