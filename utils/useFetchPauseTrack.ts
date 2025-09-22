import type { IPauseTrack, IPauseTrackPost, ListPauseResponse } from "~/types/tablePauseTrack"

const URL = import.meta.env.VITE_BASEROW_URL
const PAUSETRACK_ID = import.meta.env.VITE_BASEROW_PAUSETRACK
const TOKEN = import.meta.env.VITE_BASEROW_TOKEN

/**
 * Get pause tracks
 * @returns Promise - the pause traks or the error
 */
export const fetchPauseTracks = () : Promise<IPauseTrack[]> => {
  return new Promise((resolve, reject) => {
    const uri = `${URL}/api/database/rows/table/${PAUSETRACK_ID}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:200,
        order_by:'-TimeTrack'
      }
    // Use fetch with the runtime config values
    $fetch<ListPauseResponse>(
      uri,
      {
        query: params,
        headers: {
          //Authorization: `JWT ${user?.token}`,
          Authorization: `Token ${TOKEN}`
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
 * Get one pause track
 * @param id of the track
 * @returns Promise - the pause trak or the error
 */
export const fetchPauseTrack = (id:number) : Promise<IPauseTrack> => {
  return new Promise((resolve, reject) => {
    const uri = `${URL}/api/database/rows/table/${PAUSETRACK_ID}/${id}/?user_field_names=true`
   // Use fetch with the runtime config values
   $fetch<IPauseTrack>(
     uri,
     {
       headers: {
         Authorization: `Token ${TOKEN}`
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
 * Create the pause track in the db
 * @param pauseTrack Create the pause track in db
 * @returns a Promise with the created pause track from db or the error
 */
export const fetchCreatePauseTrack = (pauseTrack:IPauseTrackPost) : Promise<IPauseTrack> => {
  return new Promise((resolve, reject) => {
    const uri = `${URL}/api/database/rows/table/${PAUSETRACK_ID}/?user_field_names=true`
   // Use fetch with the runtime config values
   $fetch<IPauseTrack>(
    uri,
     {
        method:"POST",
        headers: {
          Authorization: `Token ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body:JSON.stringify(pauseTrack),
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
 * Update the pause track in the db
 * @param pauseTrack Update the pause track in db
 * @returns a Promise with the updated pause track from db or the error
 */
export const fetchUpdatePauseTrack = (pauseTrack:IPauseTrack) : Promise<IPauseTrack> => {
  return new Promise((resolve, reject) => {
   const uri = `${URL}/api/database/rows/table/${PAUSETRACK_ID}/${pauseTrack.id}/?user_field_names=true`
   // Use fetch with the runtime config values
   $fetch<IPauseTrack>(
    uri,
     {
        method:"PATCH",
        headers: {
          Authorization: `Token ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body:{
          "Start":pauseTrack.Start,
          "End":pauseTrack.End
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
 * Dalete the pause track in the db
 * @param id of the track
 * @returns a Promise with the deleted pause track from db or the error
 */
export const fetchDeletePauseTrack = (id:number) : Promise<number> => {
  return new Promise((resolve, reject) => {
   const uri = `${URL}/api/database/rows/table/${PAUSETRACK_ID}/${id}/`
   // Use fetch with the runtime config values
   $fetch(
    uri,
     {
        method:"DELETE",
        headers: {
          Authorization: `Token ${TOKEN}`,
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
 * Get pauses for the given time track id
 * @param id, the id
 * @returns Promise - the pauses traks or the error
 */
export const fetchPauseTracksForTimeTrack = (id:number) : Promise<IPauseTrack[]> => {
  return new Promise((resolve, reject) => {
    const uri = `${URL}/api/database/rows/table/${PAUSETRACK_ID}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:200,
        order_by:'-Start',
        filters: {
          filter_type:"AND",
          filters: [
            {
              field:"TimeTrack",
              type: "link_row_has",
              value: id
            }
          ]
        }
      }
   // Use fetch with the runtime config values
   $fetch<ListPauseResponse>(
     uri,
     {
      query: params,
       headers: {
         Authorization: `Token ${TOKEN}`,
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
