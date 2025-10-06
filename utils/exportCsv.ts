export const convertTimeTrackToCSV = (tracks:ITimeTrack[], separator:string|void) => {
    const comma = !separator ? ',' : separator
    let str = ''
    for (var j = 0; j < tracks.length; j++) {
        let line = ''
        const track = tracks[j]
        line += track.id + comma
        line += track.UID[0].name + comma
        line += new Date(track.Start).toLocaleDateString() + comma
        line += new Date(track.Start).toLocaleTimeString() + comma
        line += (track.End?new Date(track.End).toLocaleDateString():"") + comma
        line += (track.End?new Date(track.End).toLocaleTimeString():"") + comma
        line += track.Duration + comma
        line += track.PauseDuration + comma
        line += track.EffectiveDuration
        str += line + '\r\n'
    }
    return str
}

export const convertToCSVFile = (tracks:ITimeTrack[], separator:string|void) :string => {
    const comma = !separator ? ',' : separator
    let header = "TrackId" + comma
    header = header + "User" + comma
    header = header +"Start date"+ comma + "Start Time" + comma
    header = header +"End date"+ comma + "End Time" + comma
    header = header +"Duration"+ comma
    header = header +"Pause Duration"+ comma
    header = header +"Effective Duration"
    header = header + "\r\n"
    let csv = convertTimeTrackToCSV(tracks, comma);
    csv = header + csv
    return csv
}

export const exportCSVFile = (tracks:ITimeTrack[], separator:string|void) => {
    const fileTitle = "TimeTracker-"+new Date().toLocaleDateString()
    const exportedFileName = fileTitle + '.csv' || 'export.csv';
    const csv = convertToCSVFile(tracks, separator)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
