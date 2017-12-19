import * as utilities from './utilities.js'
import * as annotations from './annotations.js'
import * as elevationUtils from './elevation.js'

let disableMapInteractions= map => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    document.getElementById('map').style.cursor='default';
}

let getMap = (divName='map',params={}) => {
    // Initialize the map
    var map = L.map(divName, params)

    map.setView([46.905, 7.93], 8);

    // Adding all the possible layers
    var osmOrg=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.invalidateSize()


    return map
}

////  DISPLAY TRACK   ////


let addPoint = (line,map,isLeftBar) => {
    let pointArray=line._latlngs

    let output=utilities.transformToGeoJSON(pointArray)

    if (isLeftBar) {
        let lineStyle=annotations.lineStyle
        lineStyle['pointer-events']='none'
        L.geoJSON(output, {
            color: '#FF4F4F',
            weight: 3,
        }).addTo(map)
    }
    else {
        let track=L.geoJSON(output, {
            style: annotations.lineStyle,
            onEachFeature: (feature,layer)=> {
                layer.on('mouseover', function (e) {
                    // Change elevation plot
                    const index=feature.i
                    const className='circle'+index.toString()

                    let latitude=e.latlng.lat;
                    let longitude=e.latlng.lng;

                    let km=feature.cumulativeDistance[0].toString().substr(0,5)+'km<br />'
                    let elevation=feature.elevation[0].toString()+'m'


                    let popupString='<p style="text-align:center">'+km+elevation+'</p>'
                    annotations.setCircleInPosition(annotations.circle,index,popupString,latitude,longitude,map)

                });

                layer.on('mouseout', () =>{})
            }
        })
        track.addTo(map)

        elevationUtils.addElevationPlot(output,annotations.circle)
        return track
    }

}

let showTrackOnMap = (line,map,callback,gpxFile,mainStatus) => {
    let pointArray=line._latlngs
    let output=utilities.transformToGeoJSON(pointArray)

    // lineStyle['pointer-events']='none'
    let track=L.geoJSON(output, {
        color: '#FF4F4F',
        weight: 2
    })
    track.on('click',() => {
        callback(gpxFile,map,mainStatus)
    })
    track.addTo(map)

    return track
}





export {disableMapInteractions,getMap,addPoint,showTrackOnMap}
