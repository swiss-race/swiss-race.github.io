
/// ADD TRACK //
let addTrack = (gpx,map,resolve) => {
    let track=new L.GPX(gpx,
        {
            async: true,
            marker_options: {
                startIconUrl: 'images/pin-icon-start.png',
                endIconUrl: 'images/pin-icon-end.png',
                shadowUrl: 'images/pin-shadow.png'
      }})


    track.on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
    })

    track.on('addline', e=> {
        let line=e.line
        resolve([track,line])
        // track.gpsTrack=addPoint(line,map,isLeftBar)
    })
}

export {addTrack}
