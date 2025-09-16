import { beforeAll, describe, expect, it } from 'vitest'
import type { ITokenAuth } from '~/types/tokenAuth'
import { fetchSignInUser } from '~/utils/useFetchAuth'

describe('baserow user', async () => {
  const login = import.meta.env.VITE_BASEROW_LOGIN
  const mdp = import.meta.env.VITE_BASEROW_MDP
  let tokenAuth:ITokenAuth

  beforeAll( async () => {
    // TODO : get env for server
    tokenAuth = await fetchSignInUser(login, mdp)
  })

  // login
  it('login to baserow', async () => {
    console.log("firstName:", tokenAuth.user.first_name, ", userName", tokenAuth.user.username, ", language", tokenAuth.user.language)
    console.log("token:", tokenAuth.token, ", access_token:", tokenAuth.access_token, ", refresh_token:", tokenAuth.refresh_token)
    expect(tokenAuth.user.username).toEqual(login)
    expect(tokenAuth.user.id).toEqual(133013)

  })
})
