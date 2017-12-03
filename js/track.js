
/// ADD TRACK //
class Track {
    constructor(track) {
        this.track=track
        this.gpsTrack=0 // It will be initialised in track.on('loaded')
    }
}

let addTrack = (gpx,map,isLeftBar=0) => {
    let track=new Track(new L.GPX(gpx,
        {
            async: true,
            marker_options: {
                startIconUrl: 'images/pin-icon-start.png',
                endIconUrl: 'images/pin-icon-end.png',
                shadowUrl: 'images/pin-shadow.png'
      }}))


    track.track.on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
    })

    track.track.on('addline', e=> {
        let line=e.line
        track.gpsTrack=line
        track.gpsTrack=addPoint(line,map,isLeftBar)
    })
    return track
}

export {addTrack}
