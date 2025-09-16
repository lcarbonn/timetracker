import type { ListResponse, ITimeTrack } from "~/types/tableTimeTrack";

/**
 * Get time tracks
 * @returns Promise - the time traks or the error
 */
export const fetchTimeTracks = () : Promise<ITimeTrack[]> => {
  return new Promise((resolve, reject) => {
    const url = import.meta.env.VITE_BASEROW_URL
    const tableTimeTrack = import.meta.env.VITE_BASEROW_TIMETRACK
    const token = import.meta.env.VITE_BASEROW_TOKEN

    let uri = `${url}/api/database/rows/table/${tableTimeTrack}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:200,
        order_by:'-UID'
      }
    // Use fetch with the runtime config values
    $fetch<ListResponse>(
      uri,
      {
        query: params,
        headers: {
          //Authorization: `JWT ${user?.token}`,
          Authorization: `Token ${token}`
        },
      }
    ).then((res) => {
        resolve(res.results)
    })
   .catch((error) => {
     reject(error)
   })
  })
}

/**
 * Get one time track
 * @param id of the track
 * @returns Promise - the time traks or the error
 */
export const fetchTimeTrack = (id:number) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const url = import.meta.env.VITE_BASEROW_URL
    const tableTimeTrack = import.meta.env.VITE_BASEROW_TIMETRACK
    const token = import.meta.env.VITE_BASEROW_TOKEN
    let uri = `${url}/api/database/rows/table/${tableTimeTrack}/${id}/?user_field_names=true`
   // Use fetch with the runtime config values
   $fetch<ITimeTrack>(
     uri,
     {
       headers: {
         Authorization: `Token ${token}`
       },
     }
   ).then((data) => {
        resolve(data)
    })
   .catch((error) => {
     reject(error)
   })
  })
}

/**
 * Create the time track in the db
 * @param timeTrack Create the time track in db
 * @returns a Promise with the created time track from db or the error
 */
export const fetchCreateTimeTrack = (timeTrack:ITimeTrack) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const url = import.meta.env.VITE_BASEROW_URL
    const tableTimeTrack = import.meta.env.VITE_BASEROW_TIMETRACK
    const token = import.meta.env.VITE_BASEROW_TOKEN
    let uri = `${url}/api/database/rows/table/${tableTimeTrack}/?user_field_names=true`
   // Use fetch with the runtime config values
   $fetch<ITimeTrack>(
    uri,
     {
        method:"POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        },
        body:JSON.stringify(timeTrack),
     },
   ).then((res) => {
        resolve(res)
   })
   .catch((error) => {
     reject(error)
   })
  })
}

/**
 * Update the time track in the db
 * @param timeTrack Update the time track in db
 * @returns a Promise with the updated time track from db or the error
 */
export const fetchUpdateTimeTrack = (timeTrack:ITimeTrack) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const url = import.meta.env.VITE_BASEROW_URL
    const tableTimeTrack = import.meta.env.VITE_BASEROW_TIMETRACK
    const token = import.meta.env.VITE_BASEROW_TOKEN
    let uri = `${url}/api/database/rows/table/${tableTimeTrack}/${timeTrack.id}/?user_field_names=true`
   // Use fetch with the runtime config values
   $fetch<ITimeTrack>(
    uri,
     {
        method:"PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        },
        body:{
          "Start":timeTrack.Start,
          "End":timeTrack.End
        }
     },
   ).then((res) => {
      resolve(res)
   })
   .catch((error) => {
     reject(error)
   })
  })
}

/**
 * Get last open time track for an uid
 * @param uid, the uid
 * @returns Promise - the time trak or the error
 */
export const fetchLastOpenTimeTrack = (uid:number) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const url = import.meta.env.VITE_BASEROW_URL
    const tableTimeTrack = import.meta.env.VITE_BASEROW_TIMETRACK
    const token = import.meta.env.VITE_BASEROW_TOKEN
    let uri = `${url}/api/database/rows/table/${tableTimeTrack}/?user_field_names=true`
    const params = 
      {
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
              field:"End",
              type: "empty",
              value: ""
            }
          ]
        }
      }
   // Use fetch with the runtime config values
   $fetch<ListResponse>(
     uri,
     {
      query: params,
       headers: {
         Authorization: `Token ${token}`,
       },
     }
   ).then((res) => {
      resolve(res.results[0])
    }
  )
   .catch((error) => {
     reject(error)
   })
  })
}

/**
 * Dalete the time track in the db
 * @param id of the track
 * @returns a Promise with the deleted time track from db or the error
 */
export const fetchDeleteTimeTrack = (id:number) : Promise<number> => {
  return new Promise((resolve, reject) => {
    const url = import.meta.env.VITE_BASEROW_URL
    const tableTimeTrack = import.meta.env.VITE_BASEROW_TIMETRACK
    const token = import.meta.env.VITE_BASEROW_TOKEN
    let uri = `${url}/api/database/rows/table/${tableTimeTrack}/${id}/`
   // Use fetch with the runtime config values
   $fetch(
    uri,
     {
        method:"DELETE",
        headers: {
          Authorization: `Token ${token}`,
        }
     },
   ).then(() => {
    resolve(id)
   })
   .catch((error) => {
     reject(error)
   })
  })
}

/**
 * Get trime tracks for an uid for a year
 * @param uid, the uid
 * @param year, the year
 * @returns Promise - the time trak or the error
 */
export const fetchTimeTracksUid = (uid:number, year:number) : Promise<ITimeTrack[]> => {
  return new Promise((resolve, reject) => {
    const url = import.meta.env.VITE_BASEROW_URL
    const tableTimeTrack = import.meta.env.VITE_BASEROW_TIMETRACK
    const token = import.meta.env.VITE_BASEROW_TOKEN

    let uri = `${url}/api/database/rows/table/${tableTimeTrack}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:200,
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
              field:"Year",
              type: "equal",
              value: year
            }
          ]
        }
      }
   // Use fetch with the runtime config values
   $fetch<ListResponse>(
     uri,
     {
      query: params,
       headers: {
         Authorization: `Token ${token}`,
       },
     }
   ).then((res) => {
    if(res.results) {
      resolve(res.results)
    }
   })
   .catch((error) => {
     reject(error)
   })
  })
}