import { beforeAll, describe, expect, it, test } from 'vitest'
import { is } from 'zod/v4/locales'
import { fetchSignInUser } from '~/server/useFetch/useFetchAuth'
import { fetchWorkspacePermisssions } from '~/server/useFetch/useFetchWorkspace'

describe('baserow workspace', () => {
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
  it('get workspace permissions', async () => {
    const permissions = await fetchWorkspacePermisssions(tokenAuth.access_token)
    // console.log("permissions="+JSON.stringify(permissions,null,' '))
    let isAdmin = false
    permissions.forEach(permission => {
      console.log("isAdmin:", permission.permissions.is_admin)
      isAdmin = isAdmin || Boolean(permission.permissions.is_admin)
    });
    expect(permissions).toBeDefined()
    expect(isAdmin).toEqual(true)
  })
})