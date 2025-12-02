const thousand = 1000;
const sixty = 60;
const twentyfour = 24;

// methods
export const formatTimer = (start:Date, end?:Date)  => {
  if(!end) end = new Date()
  let timerText:string =""
  if(start) {
    const t = end.getTime()-start.getTime()
    const days = Math.floor(t / (thousand * sixty * sixty * twentyfour))
    const hours = Math.floor((t % (thousand * sixty * sixty * twentyfour)) / (thousand * sixty * sixty))
    const minutes = Math.floor((t % (thousand * sixty * sixty)) / (thousand * sixty))
    const seconds = Math.floor((t % (thousand * sixty)) / thousand)
    timerText = days +"d:"+hours+"h:"+minutes+"m:"+seconds+"s"
  }
  return timerText
}

export const formatDuration = (duration:number)  => {
  let text:string =""
  if(duration) {
    const hours = Math.floor(duration)
    const minutes = Math.floor((duration * sixty) % (sixty))
    if(minutes<10)
    text = hours+"h0"+minutes
    else text = hours+"h"+minutes
  }
  return text
}
