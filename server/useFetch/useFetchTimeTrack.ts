// import type { ITimeTrack } from "~/utils/tableTimeTrack";
// import { rawFetch } from "./baserrowFetch";
// import { IBaserowListResponse } from "~/utils/tableBaserow";

// const config = useRuntimeConfig()

// const TIMETRACK_ID = config.public.tableTimetrackId

// /**
//  * Get one time track
//  * @param id of the track
//  * @returns Promise - the time traks or the error
//  */
// export const fetchTimeTrack = async (id:number) : Promise<ITimeTrack> => {
//     const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/${id}/?user_field_names=true`
//    // Use fetch with the runtime config values
//    const track = await rawFetch<ITimeTrack>( endpoint )
//    return track
// }

// /**
//  * Create the time track in the db
//  * @param timeTrack Create the time track in db
//  * @returns a Promise with the created time track from db or the error
//  */
// export const fetchCreateTimeTrack = async (timeTrack:ITimeTrack) : Promise<ITimeTrack> => {
//     const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
//     const track =  await rawFetch<ITimeTrack>(endpoint, 
//      {
//         method:"POST",
//         body:JSON.stringify(timeTrack),
//      },
//    )
//    return track
// }

// /**
//  * Update the time track in the db
//  * @param timeTrack Update the time track in db
//  * @returns a Promise with the updated time track from db or the error
//  */
// export const fetchUpdateTimeTrack = async (timeTrack:ITimeTrack) : Promise<ITimeTrack> => {
//     const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/${timeTrack.id}/?user_field_names=true`
//     const track =  await rawFetch<ITimeTrack>(endpoint, 
//       {
//         method:"PATCH",
//         body : {
//           "Start":timeTrack.Start,
//           "End":timeTrack.End
//         }
//       })
//     return track
// }

// /**
//  * Get time track for an uid of the today
//  * @param uid, the uid
//  * @returns Promise - the time trak or the error
//  */
// export const fetchTodayTrack = async (uid:number) : Promise<ITimeTrack> => {
//     let endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
//     const params = 
//       {
//         page:1,
//         size:1,
//         order_by:'-Start',
//         filters: {
//           filter_type:"AND",
//           filters: [
//             {
//               field:"UID",
//               type: "multiple_collaborators_has",
//               value: uid
//             },
//             {
//               field:"Start",
//               type: "date_is",
//               value: "Europe/Paris??today"
//             }
//           ]
//         }
//       }
//     // Use fetch with the runtime config values
//     const response =  await rawFetch<IBaserowListResponse>(endpoint, 
//       {
//         method:"GET",
//         query : params
//       })
//     // get associated pauses
//     const track = response.results[0]
//     // if(track) {
//     //   const pauses = await fetchPausesOfTrack(track.id)
//     //   track.pauses = pauses
//     // }
//     return track
// }

// /**
//  * Delete the time track in the db
//  * @param id of the track
//  * @returns a Promise with the deleted id
//  */
// export const fetchDeleteTimeTrack = async (id:number) : Promise<number> => {
//     const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/${id}/`
//     await rawFetch(endpoint, 
//       {
//         method:"DELETE",
//       })
//     return id
// }

// /**
//  * Get time tracks for an uid for a week
//  * @param uid, the uid
//  * @param week, the week number
//  * @returns Promise - the time trak or the error
//  */
// export const fetchTracksOfTheWeek = async (uid:number, week:number) : Promise<ITimeTrack[]> => {
//     let tracks:ITimeTrack[] = []
//     const endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
//     const params = 
//       {
//         page:1,
//         size:10,
//         order_by:'-Start',
//         filters: {
//           filter_type:"AND",
//           filters: [
//             {
//               field:"UID",
//               type: "multiple_collaborators_has",
//               value: uid
//             },
//             {
//               field:"Week",
//               type: "equal",
//               value: week
//             }
//           ]
//         }
//       }
//   const response =  await rawFetch<IBaserowListResponse>(endpoint, 
//     {
//       method:"GET",
//       query : params
//     })
//   if(response?.results) {
//     tracks = response.results
//   }
//   return tracks
// }

// /**
//  * Get last open time track for an uid
//  * @param uid, the uid
//  * @returns Promise - the time trak or the error
//  */
// export const fetchLastOpenTrack = async (uid:number) : Promise<ITimeTrack> => {
//     let endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
//     const params = 
//       {
//         page:1,
//         size:1,
//         order_by:'-Start',
//         filters: {
//           filter_type:"AND",
//           filters:[
//               {type:"multiple_collaborators_has",field:"UID",value:uid}
//             ],
//             groups:[
//               {filter_type:"OR",
//               filters:[
//                 {type:"empty",field:"End",value:""},
//                 {type:"date_is",field:"End",value:"Europe/Paris??today"}
//               ]
//               }
//             ]
//         }
//       }
//     const response =  await rawFetch<IBaserowListResponse>(endpoint, 
//       {
//         method:"GET",
//         query : params
//       })
//     // get associated pauses
//     const track = response.results[0]
//     // if(track) {
//     //   const pauses = await fetchPausesOfTrack(track.id)
//     //   track.pauses = pauses
//     // }
//     return track
// }

// /**
//  * Get time tracks
//  * @returns Promise - the time traks or the error
//  */
// export const fetchAllTimeTracks = async () : Promise<ITimeTrack[]> => {
//     let endpoint = `/api/database/rows/table/${TIMETRACK_ID}/?user_field_names=true`
//     const params = 
//       {
//         page:1,
//         size:200,
//         order_by:'-UID'
//       }
//     // Use fetch with the runtime config values
//     const response =  await rawFetch<IBaserowListResponse>(endpoint, 
//       {
//         method:"GET",
//         query : params
//       })
//     return response.results
// }

