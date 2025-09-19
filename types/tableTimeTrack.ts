/**
 * Type for TimeTrack table
 */
export interface IUID {
  id:number
  name?:string
}
/**
 * Type for TimeTrack table
 */
export interface ITimeTrack {
  id:number
  UID:IUID[]
  Start:Date
  End:Date|null
  Duration:number
  Year:number
  Week:number
}

export interface ListResponse {
  count:number
  next:string|null
  previous:string|null
  results: ITimeTrack[]
}
