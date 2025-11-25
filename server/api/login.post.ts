import { z } from 'zod'
import { fetchSignInUser } from '~/server/useFetch/useFetchAuth'
import { fetchWorkspacePermisssions } from '../useFetch/useFetchWorkspace'

const bodySchema = z.object({
  email: z.email(),
  password: z.string()
})

export default defineEventHandler(async (event) => {

    const { email, password } = await readValidatedBody(event, bodySchema.parse)

    const tokenAuth = await fetchSignInUser(email, password)

    let isAdmin = false
    const permissions = await fetchWorkspacePermisssions(tokenAuth.access_token)
    permissions.forEach(permission => {
      isAdmin = isAdmin || Boolean(permission.permissions.is_admin)
    });
    tokenAuth.user.isAdmin = isAdmin
        
    await setUserSession(event, {
      user:tokenAuth.user,
      secure:{
        refresh_token:tokenAuth.refresh_token,
        access_token:tokenAuth.access_token
      }
    })
    return (tokenAuth.user.first_name)
})