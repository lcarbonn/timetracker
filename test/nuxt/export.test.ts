import { beforeAll, describe, expect, it, test } from 'vitest'
import { fetchAllTimeTracks } from '~/server/useFetch/useFetchTimeTrack'

import { convertToCSVFile } from '~/utils/exportCsv'

function logTrack(tt:ITimeTrack) {
  console.log(tt.id,", ",tt.UID, ", ", tt.UID[0].name, ", ", tt.Start, ", ", tt.End, ', ', tt.Duration, ', ', tt.Year)
}

describe('baserow export', () => {

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