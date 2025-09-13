import { beforeAll, describe, expect, it, test } from 'vitest'
import type { ITimeTrack } from '~/types/tableTimeTrack'
import type { ITokenAuth } from '~/types/tokenAuth'
import { fetchCreateTimeTrack, fetchDeleteTimeTrack, fetchTimeTracks, fetchUpdateTimeTrack } from '~/utils/useFetchTimeTrack'

describe('baserow time tracker', () => {
  let TEST_TT:ITimeTrack
  const login = import.meta.env.VITE_BASEROW_LOGIN
  const mdp = import.meta.env.VITE_BASEROW_MDP
  let user_id:number = 0

  beforeAll(async () => {
    const  authUser:ITokenAuth= await fetchSignInUser(login, mdp)
    useAuthUser().value = authUser
    user_id = getUserIdFromToken(authUser.token)
  })

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
    const tts:ITimeTrack[] = await fetchTimeTracksUid(user_id)
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
        {"id":user_id}
      ],
      "Start": now
    }
    const tt = await fetchCreateTimeTrack(ct as ITimeTrack)
    TEST_TT = tt
    console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].id, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration)
    expect(tt.UID[0].id).toEqual(user_id)
  })

  // read test time track
  it('get one row form baserow', async () => {
    const tt:ITimeTrack = await fetchTimeTrack(1)
    console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].id, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration)
    expect(tt.UID[0].id).toEqual(user_id)
  })

  // get  last open time tracks
  it('get last open time track for an uid', async () => {
    const tt:ITimeTrack = await fetchLastOpenTimeTrack(user_id)
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