import { beforeAll, describe, expect, it } from 'vitest'

describe('get duration', async () => {
  // format timer
  it('format timer', async () => {
    const start = new Date()
    const end = new Date(start)
    end.setMinutes(end.getMinutes()+2)
    end.setHours(end.getHours()+1)
    const text = formatTimer(start, end)
    console.log("duration:", text)
    expect(text).toEqual("0d:1h:2m:0s")
  })

  // format duration
  it('format duration', async () => {
    let duration:number = 26.25
    let text = formatDuration(duration)
    console.log("duration:", text)
    expect(text).toEqual("26h15")
    duration = 146.50
    text = formatDuration(duration)
    console.log("duration:", text)
    expect(text).toEqual("146h30")
  })
})
