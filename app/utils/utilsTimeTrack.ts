/**
 * Refresh the state track
 * @param track, the track to refresh
 */
export function refreshStateTrack(track: ITimeTrack) {
  const stateTrack = useStateTrack()
  if (!stateTrack.value) return
  const now = new Date(new Date().toDateString())
  const end = track.End ? new Date(new Date(track.End).toDateString()) : null
  if (end && (end.getTime() != now.getTime())) stateTrack.value = undefined
  else {
    if (stateTrack.value.pauses) track.pauses = stateTrack.value.pauses
    stateTrack.value = Object.assign([], track)
  }
}
/**
 * Refresh the state of tracks with the track
 * @param track, the track to refresh
 */
export function refreshTrackInTracksOfTheWeek(track: ITimeTrack) {
  if (!useStateTracksOfTheWeek().value) return
  const tracks = useStateTracksOfTheWeek().value
  for (let index = 0; index < tracks.length; index++) {
    const stateTrack = tracks[index]
    if (stateTrack.id == track.id) {
      track.pauses = stateTrack.pauses
      tracks[index] = Object.assign([], track)
    }
  }
}

/**
 * Add the state of tracks with the track
 * @param track, the track to refresh
 */
export function addTrackInTracksOfTheWeek(track: ITimeTrack) {
  if (!useStateTracksOfTheWeek().value) return
  const tracks = useStateTracksOfTheWeek().value
  tracks.push(track)
}

/**
 * Delete the track from the state of tracks
 * @param track, the track to refresh
 */
export function deleteTrackFromTracksOfTheWeek(id: number) {
  if (!useStateTracksOfTheWeek().value) return
  const tracks = useStateTracksOfTheWeek().value
  for (let index = 0; index < tracks.length; index++) {
    const stateTrack = tracks[index]
    if (stateTrack.id == id) {
      tracks.splice(index, 1)
    }
  }
}
