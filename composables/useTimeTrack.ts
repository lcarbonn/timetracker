/**
 * get time tracks for the week and set state
 * @param week
 */
export const getStateTimeTracksOfTheWeek = (week:number) :Promise<ITimeTrack[]>=> {
  return new Promise((resolve, reject) => {
    $fetch<ITimeTrack[]>('/api/timetracks', {
      method: 'GET',
        params: {
            week:week,
        }
    })
    .then((list) => {
        useTimeTracksOfTheWeek().value = list
        list.forEach(track => {
          getTimeTrackPauses(track.id)
          .then((pauses) => {
            track.pauses = pauses
            refreshTimeInTracksOfTheWeek(track)
          })
        })
        resolve(list)
    })
  })
}

/**
 * Get the today time track
 */
export const getStateTodayTimeTrack = () :Promise<ITimeTrack>=> {
  return new Promise((resolve, reject) => {
    $fetch<ITimeTrack>('/api/todaytrack', {
      method: 'GET',
    })
    .then((track) => {
        useTimeTrack().value = track
        if(track) {
          getTimeTrackPauses(track.id)
          .then((pauses) => {
            const stateTime = useTimeTrack().value
            if(stateTime) stateTime.pauses = pauses
          })
        }
        resolve(track)
    })
  })
}

/**
 * Open a new time track for the user
 * @param user_id
 */
export const openTimeTrack = (user_id:number) :Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
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
      resolve(tt)
    })
    .catch((error) => {
        useTimeTrack().value = undefined
        reject(error)
    })
  })
}

/**
 * Close the time track
 * @param id, the time track id
 */
export const closeTimeTrack = (id:number) :Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    $fetch<ITimeTrack>('/api/timetrack', {
        method: 'PATCH',
        body: {
            id:id,
            End:new Date()
        }
    })
    .then ((tt) => {
      const time = useTimeTrack().value
      if(time) {
        tt.pauses = time.pauses
      }
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
 * Reopenthe time track
 * @param id, the time track id
 */
export const reopenTimeTrack = (id:number) :Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    $fetch<ITimeTrack>('/api/timetrack', {
        method: 'PATCH',
        body: {
            id:id,
            End:null
        }
    })
    .then ((tt) => {
      const time = useTimeTrack().value
      if(time) {
        tt.pauses = time.pauses
      }
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
 * Delete the time track
 * @param id, the time track id
 */
export const deleteStateTrack = (id:number) : Promise<void>=> {
  return new Promise((resolve, reject) => {
    $fetch<ITimeTrack>('/api/timetrack', {
      method: 'DELETE',
      params:{
        id:id
      }
    })
    .then((tt) => {
      resolve()
    })
    if(useTimeTrack().value?.id == id) {
      useTimeTrack().value = undefined
    }
  })
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
      const time = useTimeTrack().value
      if(time) {
        tt.pauses = time.pauses
      }
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
export const refreshTimeInTracksOfTheWeek = (track:ITimeTrack) => {
    const tracks = useTimeTracksOfTheWeek().value
    for (let index = 0; index < tracks.length; index++) {
      const stateTrack = tracks[index];
      if(stateTrack.id == track.id) {
        track.pauses = stateTrack.pauses
        tracks[index] = Object.assign([], track)
      }
    }
}

/**
 * Delete the track from the state of tracks
 * @param track, the track to refresh
 */
export const deleteTimeFromTimeTracksOfTheWeek = (id:number) => {
    const tracks = useTimeTracksOfTheWeek().value
    for (let index = 0; index < tracks.length; index++) {
      const stateTrack = tracks[index];
      if(stateTrack.id == id) {
        tracks.splice(index, 1)
      }
    }
}
