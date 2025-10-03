import type { ListTimeResponse, ITimeTrack } from "~/utils/tableTimeTrack";
import { rawFetch } from "./baserrowFetch";
import { track } from "happy-dom/lib/PropertySymbol.js";
import { fetchPausesOfTrack } from "./useFetchPauseTrack";

const config = useRuntimeConfig()

const BASEROW_URL = config.baserowApiUrl
const TIMETRACK_ID = config.public.tableTimetrackId
const TOKEN = config.baserowToken

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
export const fetchCreateTimeTrack = async (timeTrack:ITimeTrack) : Promise<ITimeTrack> => {
    const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
    const track =  await rawFetch<ITimeTrack>(endpoint, 
     {
        method:"POST",
        headers: {
          Authorization: `Token ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body:JSON.stringify(timeTrack),
     },
   )
   return track
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
}

/**
 * Get time track for an uid of the today
 * @param uid, the uid
 * @returns Promise - the time trak or the error
 */
export const fetchTodayTrack = async (uid:number) : Promise<ITimeTrack> => {
    let endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
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
    const response =  await rawFetch<ListTimeResponse>(endpoint, 
      {
        method:"GET",
        query : params
      })
    // get associated pauses
    const track = response.results[0]
    const pauses = await fetchPausesOfTrack(track.id)
    track.pauses = pauses

    return track
}

/**
 * Dalete the time track in the db
 * @param id of the track
 * @returns a Promise with the deleted time track from db or the error
 */
export const fetchDeleteTimeTrack = async (id:number) : Promise<number> => {
    const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/${id}/`
    await rawFetch(endpoint, 
      {
        method:"DELETE",
      })
    return id
  //  const uri = `${BASEROW_URL}/api/database/rows/table/${TIMETRACK_ID}/${id}/`
  //  // Use fetch with the runtime config values
  //  $fetch(
  //   uri,
  //    {
  //       method:"DELETE",
  //       headers: {
  //         Authorization: `Token ${TOKEN}`,
  //       }
  //    },
}

/**
 * Get time tracks for an uid for a week
 * @param uid, the uid
 * @param week, the week number
 * @returns Promise - the time trak or the error
 */
export const fetchTracksOfTheWeek = async (uid:number, week:number) : Promise<ITimeTrack[]> => {
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
  if(response?.results) {
    tracks = response.results
    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index];
      const pauses = await fetchPausesOfTrack(track.id)
      track.pauses = pauses
    }
  }
  return tracks
}

/**
 * Get last open time track for an uid
 * @param uid, the uid
 * @returns Promise - the time trak or the error
 */
export const fetchLastOpenTrack = async (uid:number) : Promise<ITimeTrack> => {
    let endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
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
    const response =  await rawFetch<ListTimeResponse>(endpoint, 
      {
        method:"GET",
        query : params
      })
    // get associated pauses
    const track = response.results[0]
    const pauses = await fetchPausesOfTrack(track.id)
    track.pauses = pauses

    return track
}

/**
 * Get time tracks
 * @returns Promise - the time traks or the error
 */
export const fetchAllTimeTracks = async () : Promise<ITimeTrack[]> => {
    let endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:200,
        order_by:'-UID'
      }
    // Use fetch with the runtime config values
    const response =  await rawFetch<ListTimeResponse>(endpoint, 
      {
        method:"GET",
        query : params
      })
    return response.results
}

