/**
 * get pause tracks for the time track id
 * @param timeId
 */
export const getPausesOfTrack = async (timeId:number) :Promise<IPauseTrack[]> => {
    const result = await $fetch<IPauseTrack[]>('/api/pausetrack/pausetracks', {
      query: {
        timeId:timeId,
      },
      onResponse ({ response }) {
        // Handle the response errors
        // const pauses = response._data
        // refreshPausesInStateTrack(pauses)
        // refreshPausesInTracksOfTheWeek(timeId, pauses)
      },
      onResponseError ({ response}) {
        // Handle the response errors
        console.error("❌ Fetch failed:", response.statusText)
        errorToSnack("Error get pauses of track", response.statusText)
      }
    })
    return result
}

/**
 * Open a new pause track for the time
 * @param timeId
 */
export const openPauseTrack = async (timeId:number) :Promise<IPauseTrack>=> {
    const result = await $fetch<IPauseTrack>('/api/pausetrack', {
        method: 'POST',
        body: {
          "TimeTrack":timeId,
          "Start": new Date()
        },
      onResponse ({ response }) {
        // Handle the response errors
        const pause = response._data
        refreshCurrentStatePause(pause)
        refreshPauseInStateTrack(pause)
      },
      onResponseError ({ response }) {
        // Handle the response errors
        useStatePause().value = undefined
        errorToSnack("Error creating pause", response.statusText)
      },
    })
    return result

}

/**
 * Close the pause track
 * @param id, the pause track id
 */
export const closePauseTrack = async (id:number) :Promise<IPauseTrack> => {
    const result = $fetch<IPauseTrack>('/api/pausetrack', {
        method: 'PATCH',
        body: {
            id:id,
            End:new Date()
        },
      onResponse ({ response }) {
        // Handle the response errors
        const pause = response._data
        useStatePause().value = undefined
        refreshPauseInStateTrack(pause)
        refreshPauseInTracksOfTheWeek(pause)
      },
      onResponseError ({ response }) {
        // Handle the response errors
        useStatePause().value = undefined
        errorToSnack("Error updating pause", response.statusText)
      },
    })
    return result
}

/**
 * Reopen the pause track
 * @param id, the pause track id
 */
export const reopenPauseTrack = async (id:number) :Promise<IPauseTrack> => {
    const result = await $fetch<IPauseTrack>('/api/pausetrack', {
        method: 'PATCH',
        body: {
            id:id,
            End:null
        },
      onResponse ({ response }) {
        // Handle the response errors
        const pause = response._data
        refreshCurrentStatePause(pause)
        refreshPauseInStateTrack(pause)
        refreshPauseInTracksOfTheWeek(pause)
      },
      onResponseError ({ response }) {
        // Handle the response errors
        useStatePause().value = undefined
        errorToSnack("Error updating pause", response.statusText)
      },
    })
    return result
}

/**
 * Delete the pause track
 * @param id, the pause track id
 */
export const deleteStatePause = async (id:number) :Promise<void> => {
    const result = await $fetch<IPauseTrack>('/api/pausetrack', {
      method: 'DELETE',
      params:{
        id:id
      },
      onResponse ({ response }) {
        // Handle the response errors
        deleteCurrentStatePause(id)
        deletePauseFromStateTrack(id)
        deletePauseFromTracksOfTheWeek(id)
      },
      onResponseError ({ response }) {
        // Handle the response errors
        useStatePause().value = undefined
        errorToSnack("Error updating pause", response.statusText)
      },
    })
    return
}

/**
 * Update the pause track
 * @param id, the pause track id
 * @param start, the start date
 * @param end, the end date
 */
export const updatePauseTrack = async (id:number, start:Date, end:Date) :Promise<IPauseTrack>=> {
    const result = await $fetch<IPauseTrack>('/api/pausetrack', {
        method: 'PATCH',
        body: {
            id:id,
            Start:start,
            End:end
        },
      onResponse ({ response }) {
        // Handle the response errors
        const pause = response._data
        refreshCurrentStatePause(pause)
        refreshPauseInStateTrack(pause)
        refreshPauseInTracksOfTheWeek(pause)
      },
      onResponseError ({ response }) {
        // Handle the response errors
        useStatePause().value = undefined
        errorToSnack("Error updating pause", response.statusText)
      },
    })
    return result
}
/**
 * Refresh the pause in the tracks of the week
 * @param pause , the pause to refresh
 */
export const refreshPauseInTracksOfTheWeek = (pause:IPauseTrack) => {
  if(!useStateTracksOfTheWeek().value) return
  const tracks = useStateTracksOfTheWeek().value
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
export const deletePauseFromTracksOfTheWeek = (id:number) => {
  if(!useStateTracksOfTheWeek().value) return
  const tracks = useStateTracksOfTheWeek().value
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
export const refreshPauseInStateTrack = (pause:IPauseTrack) => {
    const track = useStateTrack().value
    if(!track) return 
    let pauses = track.pauses
    if(!pauses) {
      pauses = []
      track.pauses = pauses
    }
    let isFound = false
    for (let index = 0; index < pauses.length; index++) {
      const stateTrack = pauses[index];
      if(stateTrack.id == pause.id) {
        pauses[index] = Object.assign([], pause)
        isFound = true
      }
    }
    if(!isFound) pauses.push(pause)
}

/**
 * Delete pause form the state track
 * @param id, the id of the track
 */
export const deletePauseFromStateTrack = (id:number) => {
    if(!useStateTrack().value) return
    const pauses = useStateTrack().value?.pauses
    if(!pauses) return
    for (let index = 0; index < pauses.length; index++) {
      const stateTrack = pauses[index];
      if(stateTrack.id == id) {
        pauses.splice(index, 1)
      }
    }
}

const refreshCurrentStatePause = (pause:IPauseTrack) => {
  const currentPause = useStatePause().value
  if(currentPause?.id == pause.id) useStatePause().value = pause
  if(!pause.End) useStatePause().value = pause
}

const deleteCurrentStatePause = (id:number) => {
  const currentPause = useStatePause().value
  if(currentPause?.id == id) useStatePause().value = undefined
}

/**
 * Refresh pauses in the current time track
 * @param pauses, the pauses to refresh
 */
export const refreshPausesInStateTrack = (pauses:IPauseTrack[]) => {
    const track = useStateTrack()
    if(!track.value) return
    track.value.pauses = pauses
    const last = pauses.length -1
    if(last!=-1 && pauses[last].End==null) {
      useStatePause().value = pauses[last]
    } 
}

/**
 * Refresh pauses in the tracks of the week
 * @param pauses , the pauses to refresh
 */
export const refreshPausesInTracksOfTheWeek = (timeId:number, pauses:IPauseTrack[]) => {
  if(!useStateTracksOfTheWeek().value) return
  const tracks = useStateTracksOfTheWeek().value
  tracks.forEach(track => {
    if(track.id == timeId ){
      track.pauses = pauses
    }
 });
}
