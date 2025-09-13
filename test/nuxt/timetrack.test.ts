import { describe, expect, it, test } from 'vitest'
import type { ITimeTrack } from '~/types/tableTimeTrack'
import { fetchCreateTimeTrack, fetchDeleteTimeTrack, fetchTimeTracks, fetchUpdateTimeTrack } from '~/utils/useFetchTimeTrack'

describe('baserow time tracker', () => {
  let TEST_TT:ITimeTrack
  const TEST_UID:number = 133013

  // count all times
  it('count all times form baserow', async () => {
    const tts:ITimeTrack[] = await fetchTimeTracks()
    console.log("tts="+tts.length)
    tts.forEach(tt => {
      console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].id, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration)
    });
    expect(tts.length).toBeGreaterThan(0)
  })

  // count all times for an uid
  it('count all times for an uid', async () => {
    const tts:ITimeTrack[] = await fetchTimeTracksUid(TEST_UID)
    console.log("tts="+tts.length)
    tts.forEach(tt => {
      console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].id, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration)
    });
    expect(tts.length).toBeGreaterThan(0)
  })

  // Create new time track
  it('create one row in baserow', async () => {
    const now = new Date()
    const ct = {
      "UID":[
        {"id":TEST_UID}
      ],
      "Start": now
    }
    const tt = await fetchCreateTimeTrack(ct as ITimeTrack)
    TEST_TT = tt
    console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].id, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration)
    expect(tt.UID[0].id).toEqual(TEST_UID)
  })

  // read test time track
  it('get one row form baserow', async () => {
    const tt:ITimeTrack = await fetchTimeTrack(1)
    console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].id, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration)
    expect(tt.UID[0].id).toEqual(TEST_UID)
  })

  // get  last open time tracks
  it('get last open time track for an uid', async () => {
    const tt:ITimeTrack = await fetchLastOpenTimeTrack(TEST_UID)
    console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].id, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration)
    expect(tt.id).toEqual(TEST_TT.id)
    expect(tt.End).toBeNull()
  })

    // update test time track
  it('update one row form baserow', async () => {
    const now = new Date()
    TEST_TT.End = now
    const tt = await fetchUpdateTimeTrack(TEST_TT)
    expect(tt.End).toBeDefined()
  })

    // Delete new time track
  it('delete one row in baserow', async () => {
    const id = await fetchDeleteTimeTrack(TEST_TT.id)
    expect(id).toEqual(TEST_TT.id)
  })

})