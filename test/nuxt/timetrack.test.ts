import { beforeAll, describe, expect, it, test } from 'vitest'
import { fetchSignInUser } from '~/server/useFetch/useFetchAuth'
import { fetchCreateTimeTrack, fetchDeleteTimeTrack, fetchTimeTrack, fetchTimeTracks, fetchTimeTracksWeekUid, fetchTodayTimeTrack, fetchUpdateTimeTrack } from '~/server/useFetch/useFetchTimeTrack'

function logTrack(tt:ITimeTrack) {
  console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration, ', ', tt.Year)
}

describe('baserow time tracker', () => {
  let TEST_TT:ITimeTrack
  const login = import.meta.env.VITE_BASEROW_LOGIN
  const mdp = import.meta.env.VITE_BASEROW_MDP

  let tokenAuth:IBaserowAuth
  let user_id:number

  beforeAll( async () => {
    // TODO : get env for server
    tokenAuth = await fetchSignInUser(login, mdp)
    user_id = tokenAuth.user.id
  })

  // count all times
  it('count all times form baserow', async () => {
    const tts:ITimeTrack[] = await fetchTimeTracks()
    console.log("tts="+tts.length)
    tts.forEach(tt => {
      logTrack(tt)
    });
    expect(tts.length).toBeGreaterThan(0)
  })

  // count all times for an uid
  it('count times for an uid week 36', async () => {
    const date = new Date()
    const tts:ITimeTrack[] = await fetchTimeTracksWeekUid(user_id, 36)
    console.log("tts="+tts.length)
    tts.forEach(tt => {
      logTrack(tt)
    });
    expect(tts.length).toBeGreaterThan(0)
  })

  // Create new time track
  it('create one row in baserow', async () => {
    const now = new Date()
    const ct = {
      "UID":[
        {"id":user_id}
      ],
      "Start": now
    }
    const tt = await fetchCreateTimeTrack(ct as ITimeTrack)
    TEST_TT = tt
    logTrack(tt)
    expect(tt.UID[0].id).toEqual(user_id)
  })

  // read test time track
  it('get one row form baserow', async () => {
    const tt:ITimeTrack = await fetchTimeTrack(TEST_TT.id)
    logTrack(tt)
    expect(tt.UID[0].id).toEqual(user_id)
  })

  // get  time track of the day
  it('get time track of the day for an uid', async () => {
    const tt:ITimeTrack = await fetchTodayTimeTrack(user_id)
    logTrack(tt)
    expect(tt.id).toEqual(TEST_TT.id)
    expect(tt.End).toBeNull()
  })

  // update test time track
  it('update one row form baserow', async () => {
    const now = new Date()
    TEST_TT.End = now
    logTrack(TEST_TT)
    const tt = await fetchUpdateTimeTrack(TEST_TT)
    expect(tt.End).toBeDefined()
  })

  // reset test time track
  it('reset one row form baserow', async () => {
    const now = new Date()
    TEST_TT.End = null
    logTrack(TEST_TT)
    const tt = await fetchUpdateTimeTrack(TEST_TT)
    expect(tt.End).toEqual(null)
  })

    // Delete new time track
  it('delete one row in baserow', async () => {
    const id = await fetchDeleteTimeTrack(TEST_TT.id)
    expect(id).toEqual(TEST_TT.id)
  })

})