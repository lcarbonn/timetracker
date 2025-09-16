import type { ITimeTrack } from "~/types/tableTimeTrack"

/**
 * get all times for the user and set state
 * @param user_id
 */
export const getStateTimeTracksUid = (user_id:number) => {
  const year = useYear().value
  $fetch<ITimeTrack[]>('/api/timetracks', {
    method: 'GET',
      params: {
          year:year,
      }
  })
  .then((list) => {
      useTimeTracks().value = list
  })
}

/**
 * Get the last open time track for the user
 * @param user_id
 */
export const getLastOpenTimeTrack = (user_id:number) => {
  const year = useYear().value
  $fetch<ITimeTrack>('/api/lasttrack', {
    method: 'GET',
    params:{
      user_id:user_id
    }
  })
  .then((tt) => {
      useTimeTrack().value = tt
  })
}

/**
 * Open a new time track for the user
 * @param user_id
 */
export const openTimeTrack = (user_id:number) => {
  const { user } = useUserSession()
    $fetch<ITimeTrack>('/api/timetrack', {
        method: 'POST',
        body: {
          "UID":[
            {"id":user_id}
          ],
          "Start": new Date()
        }
    })
    .then ((tt) => {
      useTimeTrack().value = tt
      
      if(user.value) getStateTimeTracksUid(user.value.id)
    })
    .catch((error) => {
        useTimeTrack().value = undefined
    })
}

/**
 * Close the time track
 * @param id, the time track id
 */
export const closeTimeTrack = (id:number) => {
  const { user } = useUserSession()
  $fetch('/api/timetrack', {
      method: 'PATCH',
      body: {
          id:id,
          End:new Date()
      }
  })
  .then ((tt) => {
    useTimeTrack().value = undefined
    if(user.value) getStateTimeTracksUid(user.value.id)      
  })
  .catch((error) => {
    useTimeTrack().value = undefined
  })
}

/**
 * Delete the time track
 * @param id, the time track id
 */
export const deleteStateTrack = (id:number) => {
    const { user } = useUserSession()
  $fetch<ITimeTrack>('/api/timetrack', {
    method: 'DELETE',
    params:{
      id:id
    }
  })
  .then((tt) => {
      if(user.value) getStateTimeTracksUid(user.value.id)      
  })
  if(useTimeTrack().value?.id == id) {
    useTimeTrack().value = undefined
  }
}
