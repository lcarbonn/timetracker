import { beforeAll, describe, expect, it } from 'vitest'
import { fetchSignInUser } from '~/server/useFetch/useFetchAuth'

describe('baserow user', async () => {
  const LOGIN = import.meta.env.VITE_BASEROW_LOGIN
  const MDP = import.meta.env.VITE_BASEROW_MDP
  const USER_ID  = import.meta.env.VITE_BASEROW_USER_ID
  let tokenAuth:IBaserowAuth

  beforeAll( async () => {
    // TODO : get env for server
    tokenAuth = await fetchSignInUser(LOGIN, MDP)
    console.log("tokenAuth"+JSON.stringify(tokenAuth,null," "))
  })

  // login
  it('login to baserow', async () => {
    console.log("firstName:", tokenAuth.user.first_name, ", userName:", tokenAuth.user.username, ", language:", tokenAuth.user.language, ", id:", tokenAuth.user.id)
    console.log("access_token:", tokenAuth.access_token, ", refresh_token:", tokenAuth.refresh_token)
    expect(tokenAuth.user.username).toEqual(LOGIN)
    expect(tokenAuth.user.id).toEqual(Number(USER_ID).valueOf())
  })
})
