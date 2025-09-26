/**
 * Return a event from a track
 * @param track 
 * @returns 
 */
export const trackToEvent = (track:ITimeTrack) :object => {
       const event = {
          title: track.End?"Day of effective "+formatDuration(track.EffectiveDuration):"Day not yet completed",
          start:track.Start,
          end:track.End?track.End:new Date(),
          color:'#378006',
          id:track.id,
          isTrack:true,
          isEnded:track.End?true:false
        }
        return event
}

/**
 * return en event form a pause
 * @param pause 
 * @returns 
 */
export const pauseToEvent = (pause:IPauseTrack) :object => {
    const event = {
        title: pause.End?"Pause of "+formatDuration(pause.Duration):"Pause started",
        start:pause.Start,
        end:pause.End?pause.End:new Date(),
        id:pause.id,
        isTrack:false,
        isEnded:pause.End?true:false
    }
    return event
}