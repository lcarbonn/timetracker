import type { IPauseTrack } from "~/types/tablePauseTrack"

/**
 * get pause tracks for the time track id
 * @param timeId
 */
export const getTimeTrackPauses = (timeId:number) :Promise<IPauseTrack[]> => {
  return new Promise((resolve, reject) => {
    $fetch<IPauseTrack[]>('/api/pausetracks', {
      method: 'GET',
        params: {
            timeId:timeId,
        }
    })
    .then((list) => {
      if(list[0].End==null) {
        usePauseTrack().value = list[0]
      }      
      resolve(list)
    })
  })
}

/**
 * Open a new pause track for the time
 * @param timeId
 */
export const openPauseTrack = (timeId:number) => {
  const { user } = useUserSession()
    $fetch<IPauseTrack>('/api/pausetrack', {
        method: 'POST',
        body: {
          "TimeTrack":timeId,
          "Start": new Date()
        }
    })
    .then ((pt) => {
      usePauseTrack().value = pt
      useTimeTrack().value?.pauses?.push(pt)
    })
    .catch((error) => {
        usePauseTrack().value = undefined
    })
}

/**
 * Close the pause track
 * @param id, the pause track id
 */
export const closePauseTrack = (id:number) => {
  $fetch<IPauseTrack>('/api/pausetrack', {
      method: 'PATCH',
      body: {
          id:id,
          End:new Date()
      }
  })
  .then ((pt) => {
    usePauseTrack().value = undefined
    refreshPauseInTimeTrack(pt)
    // const tt = useTimeTrack().value
    // if(tt?.id) {
    //   getTimeTrackPauses(tt.id)
    // }
  })
  .catch((error) => {
    usePauseTrack().value = undefined
  })
}

/**
 * Reopen the pause track
 * @param id, the pause track id
 */
export const reopenPauseTrack = (id:number) => {
  $fetch<IPauseTrack>('/api/pausetrack', {
      method: 'PATCH',
      body: {
          id:id,
          End:null
      }
  })
  .then ((pt) => {
    usePauseTrack().value = pt
    refreshPauseInTimeTrack(pt)

    // const tt = useTimeTrack().value
    //   if(tt?.id) {
    //     getTimeTrackPauses(tt.id)
    //   }
  })
  .catch((error) => {
    usePauseTrack().value = undefined
  })
}

/**
 * Delete the pause track
 * @param id, the pause track id
 */
export const deleteStatePause = (id:number) :Promise<void> => {
  return new Promise((resolve, reject) => {
    $fetch<IPauseTrack>('/api/pausetrack', {
      method: 'DELETE',
      params:{
        id:id
      }
    })
    .then((pt) => {
      resolve()
    })
    if(usePauseTrack().value?.id == id) {
      usePauseTrack().value = undefined
    }
  })
}

/**
 * Update the pause track
 * @param id, the pause track id
 * @param start, the start date
 * @param end, the end date
 */
export const updatePauseTrack = (id:number, start:Date, end:Date) :Promise<IPauseTrack>=> {
  return new Promise((resolve, reject) => {
    $fetch<IPauseTrack>('/api/pausetrack', {
        method: 'PATCH',
        body: {
            id:id,
            Start:start,
            End:end
        }
    })
    .then ((pt) => {
      usePauseTrack().value = pt
      resolve(pt)
    })
    .catch((error) => {
      usePauseTrack().value = undefined
      reject(error)
    })
  })
}
/**
 * Refresh the pause in the tracks of the week
 * @param pause , the pause to refresh
 */
export const refreshPauseInTimeTracksOfTheWeek = (pause:IPauseTrack) => {
  const tracks = useTimeTracksOfTheWeek().value
  tracks.forEach(track => {
    if(track.pauses) {
      for (let index = 0; index < track.pauses.length; index++) {
        const statePause = track.pauses[index];
        if(statePause.id == pause.id) {
          track.pauses[index] = Object.assign([], pause)
        }
      }
    }
  });
}
/**
 * Delete the pause from time tracks of the week
 * @param id , the pause id
 */
export const deletePauseFromTimeTracksOfTheWeek = (id:number) => {
  const tracks = useTimeTracksOfTheWeek().value
  tracks.forEach(track => {
    if(track.pauses) {
      for (let index = 0; index < track.pauses.length; index++) {
        const statePause = track.pauses[index];
        if(statePause.id == id) {
          track.pauses.splice(index,1)
        }
      }
    }
  });
}
/**
 * Refresh the pause in the current time track
 * @param pause, the pause to refresh
 */
export const refreshPauseInTimeTrack = (pause:IPauseTrack) => {
    const pauses = useTimeTrack().value?.pauses
    if(!pauses) return
    for (let index = 0; index < pauses.length; index++) {
      const stateTrack = pauses[index];
      if(stateTrack.id == pause.id) {
        pauses[index] = Object.assign([], pause)
      }
    }
}

/**
 * Refresh the pauses in the current time track
 * @param pauses, the pauses to refresh
 */
export const refreshPausesInTimeTrack = (pauses:IPauseTrack[]) => {
    const timeTrack = useTimeTrack().value
    if(timeTrack) timeTrack.pauses = pauses
}

/**
 * Delete pause form the state track
 * @param id, the id of the track
 */
export const deletePauseFromTimeTrack = (id:number) => {
    const pauses = useTimeTrack().value?.pauses
    if(!pauses) return
    for (let index = 0; index < pauses.length; index++) {
      const stateTrack = pauses[index];
      if(stateTrack.id == id) {
        pauses.splice(index, 1)
      }
    }
}
