import type { IPauseTrack } from "./tablePauseTrack"

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
  PauseDuration:number
  EffectiveDuration:number
  pauses:IPauseTrack[]|undefined
}

export class TimeTrack implements ITimeTrack {
  id:number=0
  UID:IUID[]=[]
  Start:Date=new Date()
  End:Date|null=null
  Duration:number=0
  Year:number=0
  Week:number=0
  PauseDuration:number=0
  EffectiveDuration:number=0
  pauses:IPauseTrack[]|undefined=undefined
}

export interface ListTimeResponse {
  count:number
  next:string|null
  previous:string|null
  results: ITimeTrack[]
}
