/**
 * Type for PauseTrack table
 */
export interface IPauseTrack {
  id:number
  TimeTrack:ITimeTrack[]
  Start:Date
  End:Date|null
  Duration:number
}

/**
 * Type for PauseTrack table for post
 */
export interface IPauseTrackPost {
  id:number
  TimeTrack:number
  Start:Date
  End:Date|null
  Duration:number
}

export class PauseTrackPost implements IPauseTrackPost {
  id:number=0
  TimeTrack:number=0
  Start:Date=new Date()
  End:Date|null = null
  Duration:number=0
}

export interface ListPauseResponse {
  count:number
  next:string|null
  previous:string|null
  results: IPauseTrack[]
}
