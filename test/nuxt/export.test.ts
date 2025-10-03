import { beforeAll, describe, expect, it, test } from 'vitest'
import { setAccessToken } from '~/server/useFetch/baserrowFetch'
import { fetchSignInUser } from '~/server/useFetch/useFetchAuth'
import { fetchAllTimeTracks } from '~/server/useFetch/useFetchTimeTrack'

import { convertToCSVFile } from '~/utils/exportCsv'

function logTrack(tt:ITimeTrack) {
  console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration, ', ', tt.Year)
}

describe('baserow export', () => {
  let TEST_TT:ITimeTrack
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

  // count all times
  it('count all times form baserow', async () => {
    const tts:ITimeTrack[] = await fetchAllTimeTracks()
    console.log("tts="+tts.length)
    const csv:string = convertToCSVFile(tts)
    console.log("csv string:", csv)
    expect(tts.length).toBeGreaterThan(0)
    expect(csv.length).toBeGreaterThan(0)
  })

})