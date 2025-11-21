import type { IPauseTrack, IPauseTrackPost } from "~/utils/tablePauseTrack"
import { rawFetch } from "./baserrowFetch"
import { IBaserowListResponse } from "~/utils/tableBaserow"

const config = useRuntimeConfig()

const PAUSETRACK_ID = config.public.tablePausetrackId

/**
 * Get pause tracks
 * @returns Promise - the pause traks or the error
 */
export const fetchAllPauseTracks = async () : Promise<IPauseTrack[]> => {
    const endpoint = `/api/database/rows/table/${PAUSETRACK_ID}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:200,
        order_by:'-TimeTrack'
      }
    // Use fetch with the runtime config values
    const resutl = await rawFetch<IBaserowListResponse>(endpoint,
      {
        query: params
      }
    )
    return resutl.results
}

/**
 * Get one pause track
 * @param id of the track
 * @returns Promise - the pause trak or the error
 */
export const fetchPauseTrack = async (id:number) : Promise<IPauseTrack> => {
  const endpoint = `/api/database/rows/table/${PAUSETRACK_ID}/${id}/?user_field_names=true`
   const pause = rawFetch<IPauseTrack>(endpoint)
   return pause
}

/**
 * Create the pause track in the db
 * @param pauseTrack Create the pause track in db
 * @returns a Promise with the created pause track from db or the error
 */
export const fetchCreatePauseTrack = async (pauseTrack:IPauseTrackPost) : Promise<IPauseTrack> => {
  const endpoint = `/api/database/rows/table/${PAUSETRACK_ID}/?user_field_names=true`
   const pause = await rawFetch<IPauseTrack>(endpoint,
     {
        method:"POST",
        body:JSON.stringify(pauseTrack),
     },
   )
    return pause
}

/**
 * Update the pause track in the db
 * @param pauseTrack Update the pause track in db
 * @returns a Promise with the updated pause track from db or the error
 */
export const fetchUpdatePauseTrack = async (pauseTrack:IPauseTrack) : Promise<IPauseTrack> => {
   const endpoint = `/api/database/rows/table/${PAUSETRACK_ID}/${pauseTrack.id}/?user_field_names=true`
   const pause = await rawFetch<IPauseTrack>(endpoint,
     {
        method:"PATCH",
        body:{
          "Start":pauseTrack.Start,
          "End":pauseTrack.End
        }
     },
    )
    return pause
}

/**
 * Dalete the pause track in the db
 * @param id of the track
 * @returns a Promise with the deleted pause track from db or the error
 */
export const fetchDeletePauseTrack = async (id:number) : Promise<number> => {
   const endpoint = `/api/database/rows/table/${PAUSETRACK_ID}/${id}/`
   await rawFetch(endpoint,
     {
        method:"DELETE",
     },
   )
   return id
}

/**
 * Get pauses for the given time track id
 * @param id, the id
 * @returns Promise - the pauses traks order by start asc or the error
 */
export const fetchPausesOfTrack = async (id:number) : Promise<IPauseTrack[]> => {
  let endpoint = `/api/database/rows/table/${PAUSETRACK_ID}/?user_field_names=true`
    const params = 
      {
        page:1,
        size:20,
        order_by:'+Start',
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
    const response =  await rawFetch<IBaserowListResponse>(endpoint, 
      {
        method:"GET",
        query: params,
      }
    )
    return response.results
}
