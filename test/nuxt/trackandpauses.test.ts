import { beforeAll, describe, expect, it, test } from 'vitest'
import { setAccessToken } from '~/server/useFetch/baserrowFetch'
import { fetchSignInUser } from '~/server/useFetch/useFetchAuth'
import { fetchCreatePauseTrack, fetchDeletePauseTrack } from '~/server/useFetch/useFetchPauseTrack'
import { fetchCreateTimeTrack, fetchDeleteTimeTrack, fetchTimeTrack, fetchTracksOfTheWeek, fetchTodayTrack, fetchUpdateTimeTrack, fetchAllTimeTracks, fetchLastOpenTrack } from '~/server/useFetch/useFetchTimeTrack'

function logTrack(tt:ITimeTrack) {
  console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration, ', ', tt.Year)
}
function logPause(pt:IPauseTrack) {
  console.log(pt.id,", ", pt.TimeTrack[0].id, ", ", pt.Start, ", ", pt.End, ', ', pt.Duration)
}

describe('baserow time tracker', () => {
  let TEST_TT:ITimeTrack
  let TEST_PT:IPauseTrack
  const login = import.meta.env.VITE_BASEROW_LOGIN
  const mdp = import.meta.env.VITE_BASEROW_MDP

  let tokenAuth:IBaserowAuth
  let user_id:number

  beforeAll( async () => {
    // TODO : get env for server
    tokenAuth = await fetchSignInUser(login, mdp)
    user_id = tokenAuth.user.id
    setAccessToken(tokenAuth.access_token)
  })

  // Create new time track
  it('create test track', async () => {
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
    expect(tt.pauses).toEqual(undefined)
    expect(tt.UID[0].id).toEqual(user_id)
  })

  // add a pause to the track
    // Create new pause track for the given timtrack
    it('create test pause', async () => {
      const now = new Date()
      const ct = {
        "TimeTrack":TEST_TT.id,
        "Start": now
      }
      const pt:IPauseTrack = await fetchCreatePauseTrack(ct as IPauseTrackPost)
      logPause(pt)
      TEST_PT = pt
      expect(pt.TimeTrack[0].id).toEqual(TEST_TT.id)
    })
  
  // get last open track
  it('get last track and associated pauses', async () => {
    const tt:ITimeTrack = await fetchLastOpenTrack(user_id)
    logTrack(tt)
    tt.pauses?.forEach(pause => {
      logPause(pause)
    });
    expect(tt.id).toEqual(TEST_TT.id)
    expect(tt.pauses?.length).toEqual(1)
  })

  // get current week tracks
  it('get week tracks with pauses', async () => {
    const week = getWeekNumber(new Date())
    const tracks = await fetchTracksOfTheWeek(user_id, week)
    expect(tracks.length).toBeGreaterThan(0)
    tracks.forEach(track => {
      if(track.id == TEST_TT.id) {
        expect(track.pauses?.length).toEqual(1)
      }
      
    });
  })

    // Delete new pause
  it('delete test pause', async () => {
    const id = await fetchDeletePauseTrack(TEST_PT.id)
    expect(id).toEqual(TEST_PT.id)
  })

  // Delete new track
  it('delete test track', async () => {
    const id = await fetchDeleteTimeTrack(TEST_TT.id)
    expect(id).toEqual(TEST_TT.id)
  })

})