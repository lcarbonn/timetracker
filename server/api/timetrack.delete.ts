import { baserowExecute } from '../useFetch/baserrowFetch'
import { fetchDeleteTimeTrack} from '../useFetch/useFetchTimeTrack'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    // let id
    // if(query.id) {
    //   id = await fetchDeleteTimeTrack(new Number(query.id).valueOf())
    // }
    return await baserowExecute(event, fetchDeleteTimeTrack, Number(query.id))

})