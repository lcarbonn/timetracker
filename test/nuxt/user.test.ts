import { describe, expect, it } from 'vitest'
import type { ITokenAuth } from '~/types/tokenAuth'
import { getUserIdFromToken } from '~/utils/jwtDecoder'

describe('baserow user', () => {
  const login = import.meta.env.VITE_BASEROW_LOGIN
  const mdp = import.meta.env.VITE_BASEROW_MDP

  // login
  it('login to baserow', async () => {
    const  authUser:ITokenAuth= await fetchSignInUser(login, mdp)
    console.log("firstName:", authUser.user.first_name, ", userName", authUser.user.username, ", language", authUser.user.language)
    console.log("token:", authUser.token, ", access_token:", authUser.access_token, ", refresh_token:", authUser.refresh_token)
    expect(authUser.user.username).toEqual(login)
  })

  it('get user id', async () => {
    const  authUser:ITokenAuth= await fetchSignInUser(login, mdp)
    const user_id = getUserIdFromToken(authUser.token)
    console.log("user_id:", user_id)
    expect(user_id).toEqual(133013)
  })
})