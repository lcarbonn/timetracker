import { z } from 'zod'
import { fetchSignInUser } from '../useFetch/useFetchAuth'

const bodySchema = z.object({
  email: z.email(),
  password: z.string()
})

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readValidatedBody(event, bodySchema.parse)

    // TODO : get env for server
    const tokenAuth = await fetchSignInUser(email, password)
    
    await setUserSession(event, {
      user:tokenAuth.user,
      secure:{
        token:tokenAuth.token,
        refresh_token:tokenAuth.refresh_token,
        access_token:tokenAuth.access_token
      }
    })
    return (tokenAuth.user.first_name)
  } catch (error) {
    console.error(error)
    return (error)    
  }
})