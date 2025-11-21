/**
 * Refresch the pause in state if is current
 * @param pause 
 */
export function refreshCurrentStatePause(pause: IPauseTrack) {
  const currentPause = useStatePause().value
  if (currentPause?.id == pause.id) useStatePause().value = Object.assign([], pause)
  if (!pause.End) useStatePause().value = Object.assign([], pause)
}

/**
 * Delete the pause in state if in state
 * @param id id of the pause
 */
export function deleteCurrentStatePause(id: number) {
  const currentPause = useStatePause().value
  if (currentPause?.id == id) useStatePause().value = undefined
}

/**
 * Refresh the pause in the tracks of the week
 * @param pause , the pause to refresh
 */
export function refreshPauseInTracksOfTheWeek(pause: IPauseTrack) {
  if (!useStateTracksOfTheWeek().value) return;
  const tracks = useStateTracksOfTheWeek().value;
  let isFound = false;
  tracks.forEach(track => {
    if (track.id == pause.TimeTrack[0].id) {
      if (!track.pauses) {
        track.pauses = [];
      }
      for (let index = 0; index < track.pauses.length; index++) {
        const statePause = track.pauses[index];
        if (statePause.id == pause.id) {
          track.pauses[index] = Object.assign([], pause);
          isFound = true;
        }
      }
      if (!isFound) track.pauses.push(pause);
    }
  });
}

/**
 * Delete the pause from time tracks of the week
 * @param id , the pause id
 */
export function deletePauseFromTracksOfTheWeek(id: number) {
  if (!useStateTracksOfTheWeek().value) return;
  const tracks = useStateTracksOfTheWeek().value;
  tracks.forEach(track => {
    if (track.pauses) {
      for (let index = 0; index < track.pauses.length; index++) {
        const statePause = track.pauses[index];
        if (statePause.id == id) {
          track.pauses.splice(index, 1);
        }
      }
    }
  });
}
/**
 * Refresh the pause in the current time track
 * @param pause, the pause to refresh
 */
export function refreshPauseInStateTrack(pause: IPauseTrack) {
  const track = useStateTrack().value;
  if (!track) return;
  let pauses = track.pauses;
  if (!pauses) {
    pauses = [];
    track.pauses = pauses;
  }
  let isFound = false;
  for (let index = 0; index < pauses.length; index++) {
    const stateTrack = pauses[index];
    if (stateTrack.id == pause.id) {
      pauses[index] = Object.assign([], pause);
      isFound = true;
    }
  }
  if (!isFound) pauses.push(pause);
}

/**
 * Delete pause form the state track
 * @param id, the id of the track
 */
export function deletePauseFromStateTrack(id: number) {
  if (!useStateTrack().value) return;
  const pauses = useStateTrack().value?.pauses;
  if (!pauses) return;
  for (let index = 0; index < pauses.length; index++) {
    const stateTrack = pauses[index];
    if (stateTrack.id == id) {
      pauses.splice(index, 1);
    }
  }
}

/**
 * Refresh pauses in the current time track
 * @param pauses, the pauses to refresh
 */
export function refreshPausesInStateTrack(pauses: IPauseTrack[]) {
  const track = useStateTrack();
  if (!track.value) return;
  track.value.pauses = pauses;
  const last = pauses.length - 1;
  if (last != -1 && pauses[last].End == null) {
    useStatePause().value = pauses[last];
  }
}

/**
 * Refresh pauses in the tracks of the week
 * @param pauses , the pauses to refresh
 */
export function refreshPausesInTracksOfTheWeek(timeId: number, pauses: IPauseTrack[]) {
  if (!useStateTracksOfTheWeek().value) return;
  const tracks = useStateTracksOfTheWeek().value;
  tracks.forEach(track => {
    if (track.id == timeId) {
      track.pauses = pauses;
    }
  });
}
