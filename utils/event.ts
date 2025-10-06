/**
 * Return a event from a track
 * @param track 
 * @returns 
 */
export const trackToEvent = (track:ITimeTrack, isRestart:boolean) :object => {
       const event = {
          title: track.End?"Day of effective "+formatDuration(track.EffectiveDuration):"Day not yet completed",
          start:track.Start,
          end:track.End?track.End:new Date(),
          color:'#378006',
          id:track.id,
          durationEditable:track.End?true:false,
          isTrack:true,
          isEnded:track.End?true:false,
          isRestart:isRestart
        }
        return event
}

/**
 * return en event form a pause
 * @param pause 
 * @returns 
 */
export const pauseToEvent = (pause:IPauseTrack, isRestart:boolean) :object => {
    const event = {
        title: pause.End?"Pause of "+formatDuration(pause.Duration):"Pause started",
        start:pause.Start,
        end:pause.End?pause.End:new Date(),
        id:pause.id,
        durationEditable:pause.End?true:false,
        isTrack:false,
        isEnded:pause.End?true:false,
        isRestart:isRestart
    }
    return event
}

/**
 * Return a event from a track
 * @param track 
 * @returns 
 */
export const newTrackToEvent = (date?:Date) :any => {
       const track = new TimeTrack()
       let now = new Date()
       if(date) now = date
       track.Start = new Date(now.toDateString())
       track.Start.setHours(8)
       track.End = new Date(now.toDateString())
       track.End.setHours(18)
       const event = {
          // title: track.End?"Day of effective "+formatDuration(track.EffectiveDuration):"Day not yet completed",
          start:track.Start,
          end:track.End,
          // color:'#378006',
          // // id:track.id,
          // durationEditable:track.End?true:false,
          extendedProps: {
            isTrack:true,
            isEnded:true,
            // isRestart:false
          }
        }
        return event
}

/**
 * Return a event from a track
 * @param track 
 * @returns 
 */
export const newPauseToEvent = (timeId:number, start:Date, end:Date) :any => {
       const event = {
          start:start,
          end:end?end:new Date(),
          extendedProps: {
            isTrack:false,
            isEnded:true,
            timeId:timeId,
          }
        }
        return event
}

