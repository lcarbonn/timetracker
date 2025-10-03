import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { setAccessToken } from '~/server/useFetch/baserrowFetch'
import { fetchSignInUser } from '~/server/useFetch/useFetchAuth'
import { fetchCreatePauseTrack, fetchDeletePauseTrack, fetchPauseTrack, fetchPauseTracks, fetchPausesOfTrack, fetchUpdatePauseTrack } from '~/server/useFetch/useFetchPauseTrack'
import { fetchCreateTimeTrack, fetchDeleteTimeTrack } from '~/server/useFetch/useFetchTimeTrack'

function logPause(pt:IPauseTrack) {
  console.log(pt.id,", ", pt.TimeTrack[0].id, ", ", pt.Start, ", ", pt.End, ', ', pt.Duration)
}

describe('baserow pause tracker', () => {
  let TEST_PT:IPauseTrack
  const login = import.meta.env.VITE_BASEROW_LOGIN
  const mdp = import.meta.env.VITE_BASEROW_MDP

  let tokenAuth:IBaserowAuth
  let user_id:number
  let TEST_TIME_ID:number

  beforeAll( async () => {
    // TODO : get env for server
    tokenAuth = await fetchSignInUser(login, mdp)
    user_id = tokenAuth.user.id
    setAccessToken(tokenAuth.access_token)

    // create a new track for test
    const now = new Date()
    const ct = {
      "UID":[
        {"id":user_id}
      ],
      "Start": now
    }
    const tt = await fetchCreateTimeTrack(ct as ITimeTrack)
    TEST_TIME_ID = tt.id
    console.log("time_id:", TEST_TIME_ID)
  })

  afterAll( async () => {
    // Delete test track
    const id = await fetchDeleteTimeTrack(TEST_TIME_ID)
  })

  // count all pauses
  it('count all pauses form baserow', async () => {
    const pts:IPauseTrack[] = await fetchPauseTracks()
    console.log("tts="+pts.length)
    pts.forEach(tt => {
      logPause(tt)
    });
    expect(pts.length).toBeGreaterThan(0)
  })

  // Create new pause track for the given timtrack
  it('create one pause in baserow', async () => {
    const now = new Date()
    const ct = {
      "TimeTrack":TEST_TIME_ID,
      "Start": now
    }
    const pt:IPauseTrack = await fetchCreatePauseTrack(ct as IPauseTrackPost)
    logPause(pt)
    TEST_PT = pt
    expect(pt.TimeTrack[0].id).toEqual(TEST_TIME_ID)
  })

  // count pauses for a given timetrack
  it('count pauses for a given timetrack', async () => {
    const pts:IPauseTrack[] = await fetchPausesOfTrack(TEST_TIME_ID)
    console.log("tts="+pts.length)
    pts.forEach(tt => {
      logPause(tt)
    });
    expect(pts.length).toBeGreaterThan(0)
  })

  // read test pause track
  it('get one row form baserow', async () => {
    const pt:IPauseTrack = await fetchPauseTrack(TEST_PT.id)
    logPause(pt)
    expect(pt.TimeTrack[0].id).toEqual(TEST_TIME_ID)
  })

  // update test pause track
  it('update one row form baserow', async () => {
    const now = new Date()
    TEST_PT.End = now
    logPause(TEST_PT)
    const tt = await fetchUpdatePauseTrack(TEST_PT)
    expect(tt.End).toBeDefined()
  })

  // Delete new pause track
  it('delete one row in baserow', async () => {
    const id = await fetchDeletePauseTrack(TEST_PT.id)
    expect(id).toEqual(TEST_PT.id)
  })

})