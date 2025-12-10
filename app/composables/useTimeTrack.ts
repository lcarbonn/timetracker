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
  return (tracksdata as IBaserowListResponse).results
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

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/${id}/`;
  await $api(endpoint, {
    method: 'DELETE',
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
  });
  return;
}

export async function getTracksForExport(uid: number): Promise<globalThis.ITimeTrack[]> {
  const tracksOfTheWeek = useStateTracksOfTheWeek().value
  let tracks = tracksOfTheWeek
  if (!tracks) {
    const now = new Date()
    const currentWeek: number = getWeekNumber(now)
    // load tracks and listen to week change
    if (uid) {
      tracks = await getTracksOfTheWeek(uid, currentWeek)
    }
  }
  return tracks
}

/**
 * Get all tracks (for time tables)
 * @returns 
 */
export async function getAllTimeTracks(pagination:Pagination, filter?:Filter): Promise<IBaserowListResponse> {
  const config = useRuntimeConfig();
  const TIMETRACK_TABLE_ID = config.public.tableTimetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${TIMETRACK_TABLE_ID}/?user_field_names=true`;
  const queryBase = {
      page: pagination.pageIndex?pagination.pageIndex:1,
      size: pagination.pageSize,
      order_by: '-Start',
    }
    const queryFilters = new BaserowFilterBuilder()
    if(filter) {
      queryFilters.add("UID", "multiple_collaborators_has", filter.user)
      queryFilters.add("Year", "equal", filter.year)
      queryFilters.add("Month", "equal", filter.month)
    }
  
  const query = Object.assign({}, queryBase, queryFilters.toJSON())
  const tracksdata = await $api(endpoint, {
    method: "GET",
    query: query
  });
  return (tracksdata as IBaserowListResponse)
}
