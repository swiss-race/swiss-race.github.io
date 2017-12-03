import * as d3 from 'd3'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './gpx.js'
import * as mapUtils from './map.js'
import * as trackUtils from './track.js'
import * as utilities from './utilities.js'
import * as elevationUtils from './elevation.js'
import * as annotations from './annotations.js'


//////    ADD MAP   ////////
let map=mapUtils.getMap('map',{scrollWheelZoom:true})


let  gpxLausanne = 'gps_data/Demi-marathonLausanne.gpx' // URL to your GPX file or the GPX itself
let  gpxLausanne10 = 'gps_data/10km-Lausanne.gpx' // URL to your GPX file or the GPX itself
let  gpxLausanne20 = 'gps_data/20km-Lausanne.gpx' // URL to your GPX file or the GPX itself
let gpxZurich = 'gps_data/Zurich-marathon.gpx' // URL to your GPX file or the GPX itself
let gpxLuzern = 'gps_data/marathon-Luzern.gpx' // URL to your GPX file or the GPX itself
let gpxList=[gpxLausanne,gpxLausanne20,gpxLausanne10,gpxZurich,gpxLuzern]

let leftBar=d3.select('#leftBar')
const sheet=window.document.styleSheets[0]

let currentTrack=0
const leftSideBarRule=' {height: 200px; width:90%; z-index:0; opacity:1; pointer-events:none; }'
for (let i=0;i<gpxList.length;i++) {

    let nameDiv='#mapLeftBar'+i.toString()
    let nameDivLeaflet='mapLeftBar'+i.toString()
    sheet.insertRule(nameDiv+leftSideBarRule)
    let leftSideBarContainer=leftBar.append('div')
        .attr('id','leftSideBarContainer')
        .attr('data-colorchange',1)

    leftSideBarContainer.on('click',() => {
        if (currentTrack) {
            map.removeLayer(currentTrack)
        }
        d3.select('#elevationPlotSVG').remove()
        d3.select('#backgroundPlot').style('opacity',0)
        d3.selectAll('#leftSideBarContainer')
            .attr('data-colorchange',1)
            .style('background','rgba(255,255,255,0.01')
        leftSideBarContainer.style('background','rgba(0,0,255,0.6)')
        leftSideBarContainer.attr('data-colorchange',0)
        
        let mainMapPromise=new Promise((resolve,reject) => {
            trackUtils.addTrack(gpxList[i],map,resolve)
        })
        mainMapPromise.then((line) => {
            currentTrack=addPoint(line,map,0)
        })
    })

    leftSideBarContainer.on('mouseover',() => {
        if (leftSideBarContainer.attr('data-colorchange')==1) {
            leftSideBarContainer.style('background','rgba(10,10,10,0.6)')
        }
        leftSideBarContainer.style('cursor','pointer')
    })
    leftSideBarContainer.on('mouseout',() => {
        if (leftSideBarContainer.attr('data-colorchange')==1) {
            leftSideBarContainer.style('background','rgba(255,255,255,0.01)')
        }
    })
    leftSideBarContainer.append('div')
        .attr('id',nameDivLeaflet)


    let sideBarParams={
        scrollWheelZoom:false,
        zoomControl:false,
        attributionControl:false
    }
    let leftSideBarMap=mapUtils.getMap(nameDivLeaflet,sideBarParams)
    mapUtils.disableMapInteractions(leftSideBarMap)

    let sideBarPromise=new Promise((resolve,reject) => {
        trackUtils.addTrack(gpxList[i],leftSideBarMap,resolve)
    })
    sideBarPromise.then((line) => {
        addPoint(line,leftSideBarMap,1)
    })
}






////  DISPLAY TRACK   ////


let addPoint = (line,map,isLeftBar) => {
    let pointArray=line._latlngs

    let output=utilities.transformToGeoJSON(pointArray)

    if (isLeftBar) {
        L.geoJSON(output, {
            style: annotations.lineStyle,
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
                    
                    let elevation=feature.elevation[0].toString()
         
                    annotations.setCircleInPosition(annotations.circle,index,elevation,latitude,longitude,map)

                });
                
                layer.on('mouseout', () =>{})
            }
        })
        track.addTo(map)

        elevationUtils.addElevationPlot(output,annotations.circle)
        return track
    }

}





