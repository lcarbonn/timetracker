/**
 * Get tracks of the week for the user
 * @param uid 
 * @param week 
 * @returns 
 */
export  const getTracksOfTheWeek = (uid:number, week:number) :Promise<ITimeTrack[]> => {
    const result = $fetch<ITimeTrack[]>('/api/timetracks', {
      query: {
        uid:uid,
        week:week
      },
      onResponseError ({ response}) {
        // Handle the response errors
        console.error("❌ Fetch failed:", response.statusText)
        errorToSnack("Error in get week tracks", response.statusText)
      }
    })
    return result
  }

/**
 * Get the today time track
 */
export const getTrackOfTheDay = async (uid:number) :Promise<ITimeTrack>=> {
    const result = $fetch<ITimeTrack>('/api/todaytrack', {
      query: {
        uid:uid
      },
      onResponseError ({ response}) {
        // Handle the response errors
        console.error("❌ Fetch failed:", response.statusText)
        errorToSnack("Error in get today track", response.statusText)
      }
    })
    return result
    // $fetch<ITimeTrack>('/api/todaytrack', {
    //   method: 'GET'
    // })
    // .then((track) => {
    //     useTimeTrack().value = track
    //     if(track) {
    //       getTimeTrackPauses(track.id)
    //       .then((pauses) => {
    //         if(pauses) {
    //           const stateTime = useTimeTrack().value
    //           if(stateTime) stateTime.pauses = pauses
    //         }
    //       })
    //     }
    //     return track
    // })
    // .catch((error) => {
    //   errorToSnack("Error get today track", error)
    // })
}

/**
 * Get the last open track
 */
export const getLastOpenTrack = async (uid:number) :Promise<ITimeTrack>=> {
    const result = $fetch<ITimeTrack>('/api/lastopentrack', {
      query: {
        uid:uid
      },
      onResponseError ({ response}) {
        // Handle the response errors
        console.error("❌ Fetch failed:", response.statusText)
        errorToSnack("Error in get today track", response.statusText)
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
        useStateTrack().value = response._data
      },
      onResponseError ({ response }) {
        // Handle the response errors
        errorToSnack("Error update track", response.statusText)
      },
    })
    return result
  }
  

/**
 * Open a new time track for the user
 * @param user_id
 */
export const openTimeTrack = async (user_id:number) :Promise<ITimeTrack> => {
    const result = $fetch<ITimeTrack>('/api/timetrack', {
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
        errorToSnack("Error update track", response.statusText)
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
        useStateTrack().value = response._data
      },
      onResponseError ({ response}) {
        // Handle the response errors
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
        useStateTrack().value = response._data
      },
      onResponseError ({ response}) {
        // Handle the response errors
        errorToSnack("Error reopening track", response.statusText)
      }
    })
    return result
    // .then ((tt) => {
    //   const time = useTimeTrack().value
    //   if(time) {
    //     tt.pauses = time.pauses
    //   }
    //   useTimeTrack().value = tt
    //   return tt
    // })
    // .catch((error) => {
    //   useTimeTrack().value = undefined
    //   errorToSnack("Error reopen track", error)
    // })
}

/**
 * Delete the time track
 * @param id, the time track id
 */
export const deleteStateTrack = async (id:number) :Promise<void> => {
    await $fetch<number>('/api/timetrack', {
      method: 'DELETE',
      params:{
        id:id
      },
      onResponse ({ response }) {
        // Handle the response errors
        useStateTrack().value = undefined
      },
      onResponseError ({ response}) {
        // Handle the response errors
        errorToSnack("Error deleting track", response.statusText)
      }
    })
    return
    // .then((tt) => {
    //   return
    // })
    // .catch((error) => {
    //   errorToSnack("Error delete track", error)
    // })
    // if(useTimeTrack().value?.id == id) {
    //   useTimeTrack().value = undefined
    // }
}

// /**
//  * Update the time track
//  * @param id, the time track id
//  * @param start, the start date
//  * @param end, the end date
//  */
// export const updateTimeTrack = async (id:number, start:Date, end:Date) : Promise<ITimeTrack|void>=> {
//     $fetch<ITimeTrack>('/api/timetrack', {
//         method: 'PATCH',
//         body: {
//             id:id,
//             Start:start,
//             End:end
//         }
//     })
//     .then ((tt) => {
//       const time = useTimeTrack().value
//       if(time) {
//         tt.pauses = time.pauses
//       }
//       useTimeTrack().value = tt
//       return tt
//     })
//     .catch((error) => {
//       useTimeTrack().value = undefined
//       errorToSnack("Error update track", error)
//     })
// }
/**
 * Refresh the state of tracks with the track
 * @param track, the track to refresh
 */
export const refreshTimeInTracksOfTheWeek = (track:ITimeTrack) => {
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
 * Delete the track from the state of tracks
 * @param track, the track to refresh
 */
export const deleteTimeFromTimeTracksOfTheWeek = (id:number) => {
    const tracks = useStateTracksOfTheWeek().value
    for (let index = 0; index < tracks.length; index++) {
      const stateTrack = tracks[index];
      if(stateTrack.id == id) {
        tracks.splice(index, 1)
      }
    }
}

// /**
//  * get time tracks for the week and set state
//  * @param week
//  */
// export const getStateTimeTracksOfTheWeek = async (week:number) :Promise<ITimeTrack[]|void>=> {
//     $fetch<ITimeTrack[]>('/api/timetracks', {
//       method: 'GET',
//         params: {
//             week:week,
//         }
//     })
//     .then((list) => {
//         useTimeTracksOfTheWeek().value = list
//         list.forEach(track => {
//           getTimeTrackPauses(track.id)
//           .then((pauses) => {
//             if(pauses) track.pauses = pauses
//             refreshTimeInTracksOfTheWeek(track)
//           })
//         })
//         return list
//     })
//     .catch((error) => {
//       errorToSnack("Error get week tracks", error)
//     })
// }
