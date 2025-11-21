/**
 * Get tracks of the week for the user
 * @param uid 
 * @param week 
 * @returns 
 */
export async function getTracksOfTheWeek(uid: number, week: number): Promise<ITimeTrack[]> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  let list: ITimeTrack[] = [];
  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/?user_field_names=true`;
  const tracksdata = await $api(endpoint, {
    method: "GET",
    query: {
      page: 1,
      size: 10,
      order_by: '-Start',
      filters: {
        filter_type: "AND",
        filters: [
          {
            field: "UID",
            type: "multiple_collaborators_has",
            value: uid
          },
          {
            field: "Week",
            type: "equal",
            value: week
          }
        ]
      }
    }
  });
  if (tracksdata) {
    const resList = tracksdata as IBaserowListResponse;
    list = resList.results;
  }
  return list;
}

/**
 * Get the today time track
 */
export async function getTrackOfTheDay(uid: number): Promise<ITimeTrack> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/?user_field_names=true`;
  const response:IBaserowListResponse = await $api(endpoint, {
    method: "GET",
    query: {
        page:1,
        size:1,
        order_by:'-Start',
        filters: {
          filter_type:"AND",
          filters: [
            {
              field:"UID",
              type: "multiple_collaborators_has",
              value: uid
            },
            {
              field:"Start",
              type: "date_is",
              value: "Europe/Paris??today"
            }
          ]
        }
    }
  });
  const track = response.results[0]
  return track
}

/**
 * Get the last open track
 */
export async function getLastOpenTrack(uid: number): Promise<ITimeTrack> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/?user_field_names=true`;
  const response: IBaserowListResponse = await $api(endpoint, {
    method: "GET",
    query: {
      page: 1,
      size: 1,
      order_by: '-Start',
      filters: {
        filter_type: "AND",
        filters: [
          { type: "multiple_collaborators_has", field: "UID", value: uid }
        ],
        groups: [
          {
            filter_type: "OR",
            filters: [
              { type: "empty", field: "End", value: "" },
              { type: "date_is", field: "End", value: "Europe/Paris??today" }
            ]
          }
        ]
      }
    }
  });
  const track = response.results[0];
  return track;
}

/**
 * Update the time track
 * @param id, the time track id
 * @param start, the start date
 * @param end, the end date
 */
export async function updateTimeTrack(id: number, start: Date, end: Date): Promise<ITimeTrack> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/${id}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: "PATCH",
    body: {
      "Start": start,
      "End": end
    },
    onResponse({ response }) {
      // Handle the response errors
      const track = response._data;
      refreshStateTrack(track);
      refreshTrackInTracksOfTheWeek(track);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStateTrack().value = undefined;
      errorToSnack("Error updating track", response.statusText);
    },
  });
  return track as ITimeTrack;
}

/**
 * Open a new time track for the user
 * @param user_id
 */
export async function openTimeTrack(user_id: number): Promise<ITimeTrack> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/?user_field_names=true`
  const track = await $api(endpoint, {
    method:"POST",
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
  });
  return track as ITimeTrack
}

/**
 * Create a new time track for the user
 * @param user_id
 */
export async function createTimeTrack(user_id: number, start: Date, end: Date): Promise<ITimeTrack> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: "POST",
    body: {
      "UID": [
        { "id": user_id }
      ],
      "Start": start,
      "End": end
    },
    onResponse({ response }) {
      // Handle the response errors
      const track = response._data;
      // refreshStateTrack(track)
      addTrackInTracksOfTheWeek(track);
    },
    onResponseError({ response }) {
      // Handle the response errors
      // useStateTrack().value = undefined
      errorToSnack("Error creating track", response.statusText);
    },
  });
  return track as ITimeTrack;
}

/**
 * Close the time track
 * @param id, the time track id
 */
export async function closeTimeTrack(id: number): Promise<ITimeTrack> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/${id}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: "PATCH",
    body: {
      End: new Date()
    },
    onResponse({ response }) {
      // Handle the response errors
      const track = response._data;
      refreshStateTrack(track);
      refreshTrackInTracksOfTheWeek(track);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStateTrack().value = undefined;
      errorToSnack("Error closing track", response.statusText);
    }
  });
  return track as ITimeTrack;
}

/**
 * Reopenthe time track
 * @param id, the time track id
 */
export async function reopenTimeTrack(id: number): Promise<ITimeTrack> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/${id}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: 'PATCH',
    body: {
      End: null
    },
    onResponse({ response }) {
      // Handle the response errors
      const track = response._data;
      refreshStateTrack(track);
      refreshTrackInTracksOfTheWeek(track);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStateTrack().value = undefined;
      errorToSnack("Error reopening track", response.statusText);
    }
  });
  return track as ITimeTrack;
}

/**
 * Delete the time track
 * @param id, the time track id
 */
export async function deleteTimeTrack(id: number): Promise<void> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/${id}`;
  await $api(endpoint, {
    method: 'DELETE',
  });
  return;
}

// OLD METHODS
// /**
//  * Get tracks of the week for the user
//  * @param uid 
//  * @param week 
//  * @returns 
//  */
// export const getTracksOfTheWeek = (uid:number, week:number) :Promise<ITimeTrack[]> => {
//     const result = $fetch<ITimeTrack[]>('/api/timetrack/timetracks', {
//       query: {
//         uid:uid,
//         week:week
//       },
//       onResponseError ({ response}) {
//         // Handle the response errors
//         console.error("❌ Fetch failed:", response.statusText)
//         errorToSnack("Error get tracks of the week", response.statusText)
//       }
//     })
//     return result
//   }

// /**
//  * Get the today time track
//  */
// export const getTrackOfTheDay = async (uid:number) :Promise<ITimeTrack>=> {
//     const result = $fetch<ITimeTrack>('/api/timetrack/todaytrack', {
//       query: {
//         uid:uid
//       },
//       onResponseError ({ response}) {
//         // Handle the response errors
//         console.error("❌ Fetch failed:", response.statusText)
//         errorToSnack("Error get track of the day", response.statusText)
//       }
//     })
//     return result
// }

// /**
//  * Get the last open track
//  */
// export const getLastOpenTrack = async (uid:number) :Promise<ITimeTrack>=> {
//     const result = $fetch<ITimeTrack>('/api/timetrack/lastopentrack', {
//       query: {
//         uid:uid
//       },
//       onResponse ({response}) {
//         const track:ITimeTrack = response._data
//         // if(track) {
//         //   getPausesOfTrack(track.id)
//         // }
//       },
//       onResponseError ({ response}) {
//         // Handle the response errors
//         console.error("❌ Fetch failed:", response.statusText)
//         errorToSnack("Error last open track", response.statusText)
//       }
//     })
//     return result
// }

// /**
//  * Update the time track
//  * @param id, the time track id
//  * @param start, the start date
//  * @param end, the end date
//  */
// export  const updateTimeTrack = async (id:number, start:Date, end:Date) :Promise<ITimeTrack> => {
//     const result = await $fetch<ITimeTrack>('/api/timetrack', {
//         method: 'PATCH',
//         body: {
//             id:id,
//             Start:start,
//             End:end
//         },
//       onResponse ({ response }) {
//         // Handle the response errors
//         const track = response._data
//         refreshStateTrack(track)
//         refreshTrackInTracksOfTheWeek(track)
//       },
//       onResponseError ({ response }) {
//         // Handle the response errors
//         useStateTrack().value = undefined
//         errorToSnack("Error updating track", response.statusText)
//       },
//     })
//     return result
//   }
  

// /**
//  * Open a new time track for the user
//  * @param user_id
//  */
// export const openTimeTrack = async (user_id:number) :Promise<ITimeTrack> => {
//     const result = await $fetch<ITimeTrack>('/api/timetrack', {
//         method: 'POST',
//         body: {
//           "UID":[
//             {"id":user_id}
//           ],
//           "Start": new Date()
//         },
//       onResponse ({ response }) {
//         // Handle the response errors
//         useStateTrack().value = response._data
//       },
//       onResponseError ({ response }) {
//         // Handle the response errors
//         useStateTrack().value = undefined
//         errorToSnack("Error opening track", response.statusText)
//       },
//     })
//     return result
// }

// /**
//  * Create a new time track for the user
//  * @param user_id
//  */
// export const createTimeTrack = async (user_id:number, start:Date, end:Date) :Promise<ITimeTrack> => {
//     const result = await $fetch<ITimeTrack>('/api/timetrack', {
//         method: 'POST',
//         body: {
//           "UID":[
//             {"id":user_id}
//           ],
//           "Start": start,
//           "End": end
//         },
//       onResponse ({ response }) {
//         // Handle the response errors
//         const track = response._data
//         // refreshStateTrack(track)
//         addTrackInTracksOfTheWeek(track)
//       },
//       onResponseError ({ response }) {
//         // Handle the response errors
//         // useStateTrack().value = undefined
//         errorToSnack("Error creating track", response.statusText)
//       },
//     })
//     return result
// }

// /**
//  * Close the time track
//  * @param id, the time track id
//  */
// export const closeTimeTrack = async (id:number) :Promise<ITimeTrack> => {
//     const result = await $fetch<ITimeTrack>('/api/timetrack', {
//         method: 'PATCH',
//         body: {
//             id:id,
//             End:new Date()
//         },
//       onResponse ({ response }) {
//         // Handle the response errors
//         const track = response._data
//         refreshStateTrack(track)
//         refreshTrackInTracksOfTheWeek(track)
//       },
//       onResponseError ({ response}) {
//         // Handle the response errors
//         useStateTrack().value = undefined
//         errorToSnack("Error closing track", response.statusText)
//       }
//     })
//     return result
// }

// /**
//  * Reopenthe time track
//  * @param id, the time track id
//  */
// export const reopenTimeTrack = async (id:number) :Promise<ITimeTrack> => {
//     const result = await $fetch<ITimeTrack>('/api/timetrack', {
//         method: 'PATCH',
//         body: {
//             id:id,
//             End:null
//         },
//       onResponse ({ response }) {
//         // Handle the response errors
//         const track = response._data
//         refreshStateTrack(track)
//         refreshTrackInTracksOfTheWeek(track)
//       },
//       onResponseError ({ response}) {
//         // Handle the response errors
//         useStateTrack().value = undefined
//         errorToSnack("Error reopening track", response.statusText)
//       }
//     })
//     return result
// }

// /**
//  * Delete the time track
//  * @param id, the time track id
//  */
// export const deleteTimeTrack = async (id:number) :Promise<void> => {
//     await await $fetch<number>('/api/timetrack', {
//       method: 'DELETE',
//       params:{
//         id:id
//       },
//       onResponse ({ response }) {
//         // Handle the response errors
//         useStateTrack().value = undefined
//         deleteTrackFromTracksOfTheWeek(id)
//       },
//       onResponseError ({ response}) {
//         // Handle the response errors
//         useStateTrack().value = undefined
//         errorToSnack("Error deleting track", response.statusText)
//       }
//     })
//     return
// }

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