import type { ListTimeResponse, ITimeTrack } from "~/utils/tableTimeTrack";
import { rawFetch } from "./baserrowFetch";
import { track } from "happy-dom/lib/PropertySymbol.js";

const config = useRuntimeConfig()

const BASEROW_URL = config.baserowApiUrl
const TIMETRACK_ID = config.public.tableTimetrackId
const TOKEN = config.baserowToken

/**
 * Get time tracks
 * @returns Promise - the time traks or the error
 */
export const fetchTimeTracks = () : Promise<ITimeTrack[]> => {
  return new Promise((resolve, reject) => {
    const uri = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:200,
        order_by:'-UID'
      }
    // Use fetch with the runtime config values
    $fetch<ListTimeResponse>(
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
  })
}

/**
 * Get one time track
 * @param id of the track
 * @returns Promise - the time traks or the error
 */
export const fetchTimeTrack = (id:number) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const uri = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/${id}/?user_field_names=true`
   // Use fetch with the runtime config values
   $fetch<ITimeTrack>(
     uri,
     {
       headers: {
         Authorization: `Token ${TOKEN}`
       },
     }
   ).then((data) => {
        resolve(data)
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
    const uri = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
   // Use fetch with the runtime config values
   $fetch<ITimeTrack>(
    uri,
     {
        method:"POST",
        headers: {
          Authorization: `Token ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body:JSON.stringify(timeTrack),
     },
   ).then((res) => {
        resolve(res)
   })
  })
}

/**
 * Update the time track in the db
 * @param timeTrack Update the time track in db
 * @returns a Promise with the updated time track from db or the error
 */
export const fetchUpdateTimeTrack = async (timeTrack:ITimeTrack) : Promise<ITimeTrack> => {
    const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/${timeTrack.id}/?user_field_names=true`
    const track =  await rawFetch<ITimeTrack>(endpoint, 
      {
        method:"PATCH",
        body : {
          "Start":timeTrack.Start,
          "End":timeTrack.End
        }
      })
    return track

  //  const uri = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/${timeTrack.id}/?user_field_names=true`
  //  // Use fetch with the runtime config values
  //  $fetch<ITimeTrack>(
  //   uri,
  //    {
  //       method:"PATCH",
  //       headers: {
  //         Authorization: `Token ${TOKEN}`,
  //         "Content-Type": "application/json"
  //       },
  //       body:{
  //         "Start":timeTrack.Start,
  //         "End":timeTrack.End
  //       }
  //    },
}

/**
 * Get time track for an uid of the today
 * @param uid, the uid
 * @returns Promise - the time trak or the error
 */
export const fetchTodayTimeTrack = (uid:number) : Promise<ITimeTrack> => {
  return new Promise((resolve, reject) => {
    const uri = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
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
              field:"Start",
              type: "date_is",
              value: "Europe/Paris??today"
            }
          ]
        }
      }
    // Use fetch with the runtime config values
    $fetch<ListTimeResponse>(
      uri,
      {
        query: params,
        headers: {
          Authorization: `Token ${TOKEN}`,
        },
      }
    ).then((res) => {
      resolve(res.results[0])
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
   const uri = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/${id}/`
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
  })
}

/**
 * Get time tracks for an uid for a week
 * @param uid, the uid
 * @param week, the week number
 * @returns Promise - the time trak or the error
 */
export const fetchTimeTracksWeekUid = async (uid:number, week:number) : Promise<ITimeTrack[]> => {
    let tracks:ITimeTrack[] = []
    const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:10,
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
              field:"Week",
              type: "equal",
              value: week
            }
          ]
        }
      }
  const response =  await rawFetch<ListTimeResponse>(endpoint, 
    {
      method:"GET",
      query : params
    })
  if(response?.results) tracks = response.results
  return tracks
}

/**
 * Get time tracks for an uid for today
 * @param uid, the uid
 * @returns Promise - the time trak or the error
 */
export const fetchTimeTracksTodayUid = (uid:number) : Promise<ITimeTrack[]> => {
  return new Promise((resolve, reject) => {
    const uri = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
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
              field:"Start",
              type: "date_is",
              value: "UTC??today"
            }
          ]
        }
      }
   // Use fetch with the runtime config values
   $fetch<ListTimeResponse>(
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
  })
}

/**
 * Get last open time track for an uid
 * @param uid, the uid
 * @returns Promise - the time trak or the error
 */
export const fetchLastOpenTimeTrack = async (uid:number) : Promise<ITimeTrack> => {
    let endpoint = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
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
   return await rawFetch(endpoint)
}

