import { beforeAll, describe, expect, it } from 'vitest'

describe('get duration', async () => {
  // starting chrono
  it('get duration', async () => {
    const start = new Date()
    const end = new Date(start)
    end.setMinutes(end.getMinutes()+1)
    const text = getDuration(start, end)
    console.log("duration:", text)
    expect(text).toEqual("0d:0h:1m:0s")
  })
})
