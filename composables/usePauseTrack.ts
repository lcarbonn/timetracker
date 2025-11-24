/**
 * get pause tracks for the time track id
 * @param timeId
 */
export async function getPausesOfTrack(timeId: number): Promise<IPauseTrack[]> {
  const config = useRuntimeConfig();
  const PAUSETRACK_TABLE_ID = config.public.tablePausetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${PAUSETRACK_TABLE_ID}/?user_field_names=true`;
  const pausesdata = await $api(endpoint, {
    method: "GET",
    query: {
      page: 1,
      size: 20,
      order_by: '+Start',
      filters: {
        filter_type: "AND",
        filters: [
          {
            field: "TimeTrack",
            type: "link_row_has",
            value: timeId
          }
        ]
      }
    }
  });
  return (pausesdata as IBaserowListResponse).results;

}

/**
 * Open a new pause track for the time
 * @param timeId
 */
export async function openPauseTrack(timeId: number): Promise<IPauseTrack> {
  const config = useRuntimeConfig();
  const PAUSETRACK_TABLE_ID = config.public.tablePausetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${PAUSETRACK_TABLE_ID}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: "POST",
    body: {
      "TimeTrack": Number(timeId),
      "Start": new Date()
    },
    onResponse({ response }) {
      // Handle the response errors
      const pause = response._data;
      refreshCurrentStatePause(pause);
      refreshPauseInStateTrack(pause);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStatePause().value = undefined;
      errorToSnack("Error opening pause", response.statusText);
    },
  });
  return track as IPauseTrack;
}

/**
 * Create a new pause track for the user
 * @param user_id
 */
export async function createPauseTrack(timeId: number, start: Date, end: Date): Promise<IPauseTrack> {
  const config = useRuntimeConfig();
  const PAUSETRACK_TABLE_ID = config.public.tablePausetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${PAUSETRACK_TABLE_ID}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: "POST",
    body: {
      "TimeTrack": Number(timeId),
      "Start": new Date(start),
      "End": new Date(end)
    },
    onResponse({ response }) {
      // Handle the response errors
      const pause = response._data;
      refreshCurrentStatePause(pause);
      refreshPauseInStateTrack(pause);
      refreshPauseInTracksOfTheWeek(pause);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStatePause().value = undefined;
      errorToSnack("Error creating pause", response.statusText);
    },
  });
  return track as IPauseTrack;
}

/**
 * Close the pause track
 * @param id, the pause track id
 */
export async function closePauseTrack(id: number): Promise<IPauseTrack> {
  const config = useRuntimeConfig();
  const PAUSETRACK_TABLE_ID = config.public.tablePausetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${PAUSETRACK_TABLE_ID}/${id}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: "PATCH",
    body: {
      End: new Date()
    },
    onResponse({ response }) {
      // Handle the response errors
      const pause = response._data;
      useStatePause().value = undefined;
      refreshPauseInStateTrack(pause);
      refreshPauseInTracksOfTheWeek(pause);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStatePause().value = undefined;
      errorToSnack("Error closing pause", response.statusText);
    },
  });
  return track as IPauseTrack;
}

/**
 * Reopen the pause track
 * @param id, the pause track id
 */
export async function reopenPauseTrack(id: number): Promise<IPauseTrack> {
  const config = useRuntimeConfig();
  const PAUSETRACK_TABLE_ID = config.public.tablePausetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${PAUSETRACK_TABLE_ID}/${id}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: "PATCH",
    body: {
      End: null
    },
    onResponse({ response }) {
      // Handle the response errors
      const pause = response._data;
      refreshCurrentStatePause(pause);
      refreshPauseInStateTrack(pause);
      refreshPauseInTracksOfTheWeek(pause);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStatePause().value = undefined;
      errorToSnack("Error reopening pause", response.statusText);
    },
  });
  return track as IPauseTrack;
}

/**
 * Delete the pause track
 * @param id, the pause track id
 */
export async function deleteStatePause(id: number): Promise<void> {
  const config = useRuntimeConfig();
  const PAUSETRACK_TABLE_ID = config.public.tablePausetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${PAUSETRACK_TABLE_ID}/${id}/`;
  await $api(endpoint, {
    method: 'DELETE',
    onResponse({ response }) {
      // Handle the response errors
      deleteCurrentStatePause(id);
      deletePauseFromStateTrack(id);
      deletePauseFromTracksOfTheWeek(id);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStatePause().value = undefined;
      errorToSnack("Error deleting pause", response.statusText);
    },
  });
  return;

}

/**
 * Update the pause track
 * @param id, the pause track id
 * @param start, the start date
 * @param end, the end date
 */
export async function updatePauseTrack(id: number, start: Date, end: Date): Promise<IPauseTrack> {
  const config = useRuntimeConfig();
  const PAUSETRACK_TABLE_ID = config.public.tablePausetrackId;
  const { $api } = useNuxtApp();

  const endpoint = `/api/database/rows/table/${PAUSETRACK_TABLE_ID}/${id}/?user_field_names=true`;
  const track = await $api(endpoint, {
    method: "PATCH",
    body: {
      Start: start,
      End: end
    },
    onResponse({ response }) {
      // Handle the response errors
      const pause = response._data;
      refreshCurrentStatePause(pause);
      refreshPauseInStateTrack(pause);
      refreshPauseInTracksOfTheWeek(pause);
    },
    onResponseError({ response }) {
      // Handle the response errors
      useStatePause().value = undefined;
      errorToSnack("Error updating pause", response.statusText);
    },
  });
  return track as IPauseTrack;
}
