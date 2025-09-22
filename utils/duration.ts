// methods
export const getDuration = (start:Date, end:Date)  => {
  const thousand = 1000;
  const sixty = 60;
  const twentyfour = 24;    
  let duration:string =""
  if(start && end) {
    const t = end.getTime()-start.getTime()
    const days = Math.floor(t / (thousand * sixty * sixty * twentyfour));
    const hours = Math.floor((t % (thousand * sixty * sixty * twentyfour)) / (thousand * sixty * sixty));
    const minutes = Math.floor((t % (thousand * sixty * sixty)) / (thousand * sixty));
    const seconds = Math.floor((t % (thousand * sixty)) / thousand);
    duration = days +"d:"+hours+"h:"+minutes+"m:"+seconds+"s"
  }
  return duration
}
