import type { ITimeTrack } from "~/types/tableTimeTrack"

/**
 * get all times and set state
 */
export const getStateTimeTracksUid = (user_id:number) => {
    fetchTimeTracksUid(user_id).then((list) => {
        useTimeTracks().value = list
    })
}

export const getLastOpenTimeTrack = (user_id:number) => {
    fetchLastOpenTimeTrack(user_id)
    .then((timeTrack) => {
        useTimeTrack().value = timeTrack
    })
    .catch((error) => {
        useTimeTrack().value = undefined
    })
}

export const openTimeTrack = (user_id:number) => {
    const ct = {
      "UID":[
        {"id":user_id}
      ],
      "Start": new Date()
    }
    fetchCreateTimeTrack(ct as ITimeTrack)
    .then ((tt) => {
      useTimeTrack().value = tt
      const authUser = useAuthUser().value
      if(authUser) getStateTimeTracksUid(authUser.user.user_id)      
    })
}

export const closeTimeTrack = (id:number) => {
    const ct = {
      id:id,
      End: new Date()
    }
    fetchUpdateTimeTrack(ct as ITimeTrack)
    .then ((tt) => {
      useTimeTrack().value = undefined
      const authUser = useAuthUser().value
      if(authUser) getStateTimeTracksUid(authUser.user.user_id)      
    })
}
