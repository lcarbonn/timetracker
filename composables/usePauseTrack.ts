/**
 * get pause tracks for the time track id
 * @param timeId
 */
export const getTimeTrackPauses = async (timeId:number) :Promise<IPauseTrack[]|void> => {
    $fetch<IPauseTrack[]>('/api/pausetracks', {
      method: 'GET',
        params: {
            timeId:timeId,
        }
    })
    .then((list) => {
      const last = list.length-1
      if(last!=-1 && list[last].End==null) {
        usePauseTrack().value = list[last]
      }      
      return list
    })
    .catch((error) => {
      errorToSnack("Error get track pauses", error)
    })
}

/**
 * Open a new pause track for the time
 * @param timeId
 */
export const openPauseTrack = async (timeId:number) :Promise<IPauseTrack|void>=> {
    $fetch<IPauseTrack>('/api/pausetrack', {
        method: 'POST',
        body: {
          "TimeTrack":timeId,
          "Start": new Date()
        }
    })
    .then ((pt) => {
      usePauseTrack().value = pt
      const currentTime = useTimeTrack().value
      if(currentTime && !currentTime?.pauses) {
        currentTime.pauses = []
      }
      currentTime?.pauses?.push(pt)
      return pt
    })
    .catch((error) => {
      usePauseTrack().value = undefined
      errorToSnack("Error open pause", error)
    })
}

/**
 * Close the pause track
 * @param id, the pause track id
 */
export const closePauseTrack = async (id:number) :Promise<IPauseTrack|void> => {
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
      return pt
    })
    .catch((error) => {
      usePauseTrack().value = undefined
      errorToSnack("Error close pause", error)
    })
}

/**
 * Reopen the pause track
 * @param id, the pause track id
 */
export const reopenPauseTrack = async (id:number) :Promise<IPauseTrack|void> => {
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
      return pt
    })
    .catch((error) => {
      usePauseTrack().value = undefined
      errorToSnack("Error reopen pause", error)
    })
}

/**
 * Delete the pause track
 * @param id, the pause track id
 */
export const deleteStatePause = async (id:number) :Promise<void> => {
    $fetch<IPauseTrack>('/api/pausetrack', {
      method: 'DELETE',
      params:{
        id:id
      }
    })
    .then((pt) => {
      usePauseTrack().value = undefined
      return
    })
    .catch((error) => {
      errorToSnack("Error delete pause", error)
    })
    if(usePauseTrack().value?.id == id) {
      usePauseTrack().value = undefined
    }
}

/**
 * Update the pause track
 * @param id, the pause track id
 * @param start, the start date
 * @param end, the end date
 */
export const updatePauseTrack = async (id:number, start:Date, end:Date) :Promise<IPauseTrack|void>=> {
    $fetch<IPauseTrack>('/api/pausetrack', {
        method: 'PATCH',
        body: {
            id:id,
            Start:start,
            End:end
        }
    })
    .then ((pt) => {
      refreshCurrentStatePauseTrack(pt)
      return pt
    })
    .catch((error) => {
      usePauseTrack().value = undefined
      errorToSnack("Error update pause", error)
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

const refreshCurrentStatePauseTrack = (pause:IPauseTrack) => {
  const currentPause = usePauseTrack().value
  if(currentPause?.id == pause.id) usePauseTrack().value = pause
  if(!pause.End) usePauseTrack().value = pause
}