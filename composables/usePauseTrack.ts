import type { IPauseTrack } from "~/types/tablePauseTrack"
import type { ITimeTrack } from "~/types/tableTimeTrack"

/**
 * get pause tracks for the time track id
 * @param timeId
 */
export const getStatePauseTracks = (timeId:number) => {
  $fetch<IPauseTrack[]>('/api/pausetracks', {
    method: 'GET',
      params: {
          timeId:timeId,
      }
  })
  .then((list) => {
      usePauseTracks().value = list
      if(list[0].End==null) {
        usePauseTrack().value = list[0]
      }
  })
}

/**
 * get pause tracks for the time track id
 * @param timeId
 */
export const getStateTrackPauseTracks = (track:ITimeTrack) :Promise<void> => {
  return new Promise((resolve, reject) => {
    $fetch<IPauseTrack[]>('/api/pausetracks', {
      method: 'GET',
        params: {
            timeId:track.id,
        }
    })
    .then((list) => {
      track.pauses = list
      resolve()
    })
  })
}

// /**
//  * Get the last open time track for the user
//  * @param user_id
//  */
// export const getLastOpenTimeTrack = (user_id:number) => {
//   $fetch<ITimeTrack>('/api/lasttrack', {
//     method: 'GET',
//     params:{
//       user_id:user_id
//     }
//   })
//   .then((tt) => {
//       useTimeTrack().value = tt
//   })
// }

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
      getStatePauseTracks(timeId)
    })
    .catch((error) => {
        useTimeTrack().value = undefined
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
    const tt = useTimeTrack().value
    if(tt?.id) {
      getStatePauseTracks(tt.id)
    }
  })
  .catch((error) => {
    useTimeTrack().value = undefined
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
    const tt = useTimeTrack().value
      if(tt?.id) {
        getStatePauseTracks(tt.id)
      }
  })
  .catch((error) => {
    useTimeTrack().value = undefined
  })
}

/**
 * Delete the pause track
 * @param id, the pause track id
 */
export const deleteStatePause = (id:number) => {
  $fetch<IPauseTrack>('/api/pausetrack', {
    method: 'DELETE',
    params:{
      id:id
    }
  })
  .then((pt) => {
    const tt = useTimeTrack().value
      if(tt?.id) {
        getStatePauseTracks(tt.id)
        const { user } = useUserSession()
        // getStateTodayTimeTrack()
      }
  })
  if(usePauseTrack().value?.id == id) {
    usePauseTrack().value = undefined
  }
}
