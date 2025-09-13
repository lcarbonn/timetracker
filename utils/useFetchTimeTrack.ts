import type { ListResponse, ITimeTrack } from "~/types/tableTimeTrack";

/**
 * Get time tracks
 * @returns Promise - the time traks or the error
 */
export const fetchTimeTracks = () : Promise<ITimeTrack[]> => {
  return new Promise((resolve, reject) => {
    const { $baserowConfig } = useNuxtApp()
    const config = $baserowConfig as IBrConf
    let uri = `${config.url}/api/database/rows/table/${config.tableTimeTrack}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:200,
        order_by:'-UID'
      }
    // Use fetch with the runtime config values
    useFetch<ListResponse>(
      uri,
      {
        query: params,
        headers: {
          Authorization: `Token ${config.token}`,
        },
      }
    ).then(({data, error}) => {
      if(data.value)
        resolve(data.value.results)
      if(error.value)
        reject(error)
    }
    )
  })
}

/**
 * Get one time track
 * @param id of the track
 * @returns Promise - the time traks or the error
 */
export const fetchTimeTrack = (id:number) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const { $baserowConfig } = useNuxtApp()
    const config = $baserowConfig as IBrConf
    let uri = `${config.url}/api/database/rows/table/${config.tableTimeTrack}/${id}/?user_field_names=true`
   // Use fetch with the runtime config values
   useFetch<ITimeTrack>(
     uri,
     {
       headers: {
         Authorization: `Token ${config.token}`,
       },
     }
   ).then(({data, error}) => {
    if(data.value) {
      resolve(data.value)
    }
    if(error.value)
      reject(error)
   }
  )
  })
}

/**
 * Create the time track in the db
 * @param timeTrack Create the time track in db
 * @returns a Promise with the created time track from db or the error
 */
export const fetchCreateTimeTrack = (timeTrack:ITimeTrack) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const { $baserowConfig } = useNuxtApp()
    const config = $baserowConfig as IBrConf
    let uri = `${config.url}/api/database/rows/table/${config.tableTimeTrack}/?user_field_names=true`
   // Use fetch with the runtime config values
   useFetch<ITimeTrack>(
    uri,
     {
        method:"POST",
        headers: {
          Authorization: `Token ${config.token}`,
          "Content-Type": "application/json"
        },
        body:JSON.stringify(timeTrack),
     },
   ).then(({data, error}) => {
    if(data.value) {
      resolve(data.value)
    }
    if(error.value)
      reject(error)
   }
  )
  })
}

/**
 * Update the time track in the db
 * @param timeTrack Update the time track in db
 * @returns a Promise with the updated time track from db or the error
 */
export const fetchUpdateTimeTrack = (timeTrack:ITimeTrack) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const { $baserowConfig } = useNuxtApp()
    const config = $baserowConfig as IBrConf
    let uri = `${config.url}/api/database/rows/table/${config.tableTimeTrack}/${timeTrack.id}/?user_field_names=true`
   // Use fetch with the runtime config values
   useFetch<ITimeTrack>(
    uri,
     {
        method:"PATCH",
        headers: {
          Authorization: `Token ${config.token}`,
          "Content-Type": "application/json"
        },
        body:JSON.stringify(timeTrack),
     },
   ).then(({data, error}) => {
    if(data.value) {
      resolve(data.value)
    }
    if(error.value)
      reject(error)
   }
  )
  })
}

/**
 * Get last open time track for an uid
 * @param uid, the uid
 * @returns Promise - the time trak or the error
 */
export const fetchLastOpenTimeTrack = (uid:number) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const { $baserowConfig } = useNuxtApp()
    const config = $baserowConfig as IBrConf
    let uri = `${config.url}/api/database/rows/table/${config.tableTimeTrack}/?user_field_names=true`
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
   useFetch<ListResponse>(
     uri,
     {
      query: params,
       headers: {
         Authorization: `Token ${config.token}`,
       },
     }
   ).then(({data, error}) => {
    if(data.value) {
      resolve(data.value.results[0])
    }
    if(error.value)
      reject(error)
   }
  )
  })
}

/**
 * Dalete the time track in the db
 * @param id of the track
 * @returns a Promise with the deleted time track from db or the error
 */
export const fetchDeleteTimeTrack = (id:number) : Promise<number> => {
  return new Promise((resolve, reject) => {
    const { $baserowConfig } = useNuxtApp()
    const config = $baserowConfig as IBrConf
    let uri = `${config.url}/api/database/rows/table/${config.tableTimeTrack}/${id}/`
   // Use fetch with the runtime config values
   useFetch(
    uri,
     {
        method:"DELETE",
        headers: {
          Authorization: `Token ${config.token}`,
        }
     },
   ).then(({error}) => {
    if(error.value)
      reject(error)
    else resolve(id)
   }
  )
  })
}

/**
 * Get trime tracks for an uid
 * @param uid, the uid
 * @returns Promise - the time trak or the error
 */
export const fetchTimeTracksUid = (uid:number) : Promise<ITimeTrack[]> => {
  return new Promise((resolve, reject) => {
    const { $baserowConfig } = useNuxtApp()
    const config = $baserowConfig as IBrConf
    let uri = `${config.url}/api/database/rows/table/${config.tableTimeTrack}/?user_field_names=true`
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
            }
          ]
        }
      }
   // Use fetch with the runtime config values
   useFetch<ListResponse>(
     uri,
     {
      query: params,
       headers: {
         Authorization: `Token ${config.token}`,
       },
     }
   ).then(({data, error}) => {
    if(data.value) {
      resolve(data.value.results)
    }
    if(error.value)
      reject(error)
   }
  )
  })
}