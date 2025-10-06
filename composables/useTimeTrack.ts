/**
 * Get tracks of the week for the user
 * @param uid 
 * @param week 
 * @returns 
 */
export const getTracksOfTheWeek = (uid:number, week:number) :Promise<ITimeTrack[]> => {
    const result = $fetch<ITimeTrack[]>('/api/timetrack/timetracks', {
      query: {
        uid:uid,
        week:week
      },
      onResponse ({response}) {
        const tracks:ITimeTrack[] = response._data
        // tracks?.forEach(track => {
        //   getPausesOfTrack(track.id)
        // });
      },

      onResponseError ({ response}) {
        // Handle the response errors
        console.error("❌ Fetch failed:", response.statusText)
        errorToSnack("Error get tracks of the week", response.statusText)
      }
    })
    return result
  }

/**
 * Get the today time track
 */
export const getTrackOfTheDay = async (uid:number) :Promise<ITimeTrack>=> {
    const result = $fetch<ITimeTrack>('/api/timetrack/todaytrack', {
      query: {
        uid:uid
      },
      onResponse ({response}) {
        const track:ITimeTrack = response._data
        // if(track) {
        //   getPausesOfTrack(track.id)
        // }
      },
      onResponseError ({ response}) {
        // Handle the response errors
        console.error("❌ Fetch failed:", response.statusText)
        errorToSnack("Error get track of the day", response.statusText)
      }
    })
    return result
}

/**
 * Get the last open track
 */
export const getLastOpenTrack = async (uid:number) :Promise<ITimeTrack>=> {
    const result = $fetch<ITimeTrack>('/api/timetrack/lastopentrack', {
      query: {
        uid:uid
      },
      onResponse ({response}) {
        const track:ITimeTrack = response._data
        // if(track) {
        //   getPausesOfTrack(track.id)
        // }
      },
      onResponseError ({ response}) {
        // Handle the response errors
        console.error("❌ Fetch failed:", response.statusText)
        errorToSnack("Error last open track", response.statusText)
      }
    })
    return result
}

/**
 * Update the time track
 * @param id, the time track id
 * @param start, the start date
 * @param end, the end date
 */
export  const updateTimeTrack = async (id:number, start:Date, end:Date) :Promise<ITimeTrack> => {
    const result = await $fetch<ITimeTrack>('/api/timetrack', {
        method: 'PATCH',
        body: {
            id:id,
            Start:start,
            End:end
        },
      onResponse ({ response }) {
        // Handle the response errors
        const track = response._data
        refreshStateTrack(track)
        refreshTrackInTracksOfTheWeek(track)
      },
      onResponseError ({ response }) {
        // Handle the response errors
        useStateTrack().value = undefined
        errorToSnack("Error updating track", response.statusText)
      },
    })
    return result
  }
  

/**
 * Open a new time track for the user
 * @param user_id
 */
export const openTimeTrack = async (user_id:number) :Promise<ITimeTrack> => {
    const result = await $fetch<ITimeTrack>('/api/timetrack', {
        method: 'POST',
        body: {
          "UID":[
            {"id":user_id}
          ],
          "Start": new Date()
        },
      onResponse ({ response }) {
        // Handle the response errors
        useStateTrack().value = response._data
      },
      onResponseError ({ response }) {
        // Handle the response errors
        useStateTrack().value = undefined
        errorToSnack("Error opening track", response.statusText)
      },
    })
    return result
}

/**
 * Create a new time track for the user
 * @param user_id
 */
export const createTimeTrack = async (user_id:number, start:Date, end:Date) :Promise<ITimeTrack> => {
    const result = await $fetch<ITimeTrack>('/api/timetrack', {
        method: 'POST',
        body: {
          "UID":[
            {"id":user_id}
          ],
          "Start": start,
          "End": end
        },
      onResponse ({ response }) {
        // Handle the response errors
        const track = response._data
        // refreshStateTrack(track)
        addTrackInTracksOfTheWeek(track)
      },
      onResponseError ({ response }) {
        // Handle the response errors
        // useStateTrack().value = undefined
        errorToSnack("Error creating track", response.statusText)
      },
    })
    return result
}

/**
 * Close the time track
 * @param id, the time track id
 */
export const closeTimeTrack = async (id:number) :Promise<ITimeTrack> => {
    const result = await $fetch<ITimeTrack>('/api/timetrack', {
        method: 'PATCH',
        body: {
            id:id,
            End:new Date()
        },
      onResponse ({ response }) {
        // Handle the response errors
        const track = response._data
        refreshStateTrack(track)
        refreshTrackInTracksOfTheWeek(track)
      },
      onResponseError ({ response}) {
        // Handle the response errors
        useStateTrack().value = undefined
        errorToSnack("Error closing track", response.statusText)
      }
    })
    return result
}

/**
 * Reopenthe time track
 * @param id, the time track id
 */
export const reopenTimeTrack = async (id:number) :Promise<ITimeTrack> => {
    const result = await $fetch<ITimeTrack>('/api/timetrack', {
        method: 'PATCH',
        body: {
            id:id,
            End:null
        },
      onResponse ({ response }) {
        // Handle the response errors
        const track = response._data
        refreshStateTrack(track)
        refreshTrackInTracksOfTheWeek(track)
      },
      onResponseError ({ response}) {
        // Handle the response errors
        useStateTrack().value = undefined
        errorToSnack("Error reopening track", response.statusText)
      }
    })
    return result
}

/**
 * Delete the time track
 * @param id, the time track id
 */
export const deleteTimeTrack = async (id:number) :Promise<void> => {
    await await $fetch<number>('/api/timetrack', {
      method: 'DELETE',
      params:{
        id:id
      },
      onResponse ({ response }) {
        // Handle the response errors
        useStateTrack().value = undefined
        deleteTrackFromTracksOfTheWeek(id)
      },
      onResponseError ({ response}) {
        // Handle the response errors
        useStateTrack().value = undefined
        errorToSnack("Error deleting track", response.statusText)
      }
    })
    return
}

/**
 * Refresh the state track
 * @param track, the track to refresh
 */
export const refreshStateTrack = (track:ITimeTrack) => {
    const stateTrack = useStateTrack()
    if(!stateTrack.value) return
    const now = new Date(new Date().toDateString())
    const end = track.End? new Date(new Date(track.End).toDateString()):null
    if(end && (end.getTime() != now.getTime())) stateTrack.value = undefined
    else {
      if(stateTrack.value.pauses) track.pauses = stateTrack.value.pauses
      stateTrack.value = Object.assign([], track)
    }
}
/**
 * Refresh the state of tracks with the track
 * @param track, the track to refresh
 */
export const refreshTrackInTracksOfTheWeek = (track:ITimeTrack) => {
    if(!useStateTracksOfTheWeek().value) return
    const tracks = useStateTracksOfTheWeek().value
    for (let index = 0; index < tracks.length; index++) {
      const stateTrack = tracks[index];
      if(stateTrack.id == track.id) {
        track.pauses = stateTrack.pauses
        tracks[index] = Object.assign([], track)
      }
    }
}

/**
 * Add the state of tracks with the track
 * @param track, the track to refresh
 */
export const addTrackInTracksOfTheWeek = (track:ITimeTrack) => {
    if(!useStateTracksOfTheWeek().value) return
    const tracks = useStateTracksOfTheWeek().value
    tracks.push(track)
}

/**
 * Delete the track from the state of tracks
 * @param track, the track to refresh
 */
export const deleteTrackFromTracksOfTheWeek = (id:number) => {
    if(!useStateTracksOfTheWeek().value) return
    const tracks = useStateTracksOfTheWeek().value
    for (let index = 0; index < tracks.length; index++) {
      const stateTrack = tracks[index];
      if(stateTrack.id == id) {
        tracks.splice(index, 1)
      }
    }
}

export const getTracksForExport = async (uid:number) :Promise<globalThis.ITimeTrack[]> => {
    const tracksOfTheWeek = useStateTracksOfTheWeek().value
    let tracks = tracksOfTheWeek
    if(!tracks) {
      const now = new Date()
      const currentWeek:number = getWeekNumber(now)
      // load tracks and listen to week change
      if(uid) {
        const { data } = await useAsyncData('fetchTracks', () => getTracksOfTheWeek(uid, currentWeek))
        if(data.value) {
          tracks = data.value
        }
      }
    }
    return tracks
}