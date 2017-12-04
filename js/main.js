import * as d3 from 'd3'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './gpx.js'
import * as mapUtils from './map.js'
import * as trackUtils from './track.js'
import * as utilities from './utilities.js'
import * as elevationUtils from './elevation.js'
import * as annotations from './annotations.js'
import * as gpx_files from './gpx_files.js'


//////    ADD MAIN MAP   ////////
let map=mapUtils.getMap('map',{scrollWheelZoom:true})


////// ADD SIDE BAR //////
let gpxList=gpx_files.gpxList
let leftBar=d3.select('#leftBar')
const sheet=window.document.styleSheets[0]

let currentTrack=0
const leftSideBarRule=' {height: 200px; width:90%; z-index:0; opacity:1; pointer-events:none; }'
for (let i=0;i<gpxList.length;i++) {

    // Modify css for a new map
    let nameDiv='#mapLeftBar'+i.toString()
    let nameDivLeaflet='mapLeftBar'+i.toString()
    sheet.insertRule(nameDiv+leftSideBarRule)


    // Add container
    let leftSideBarContainer=leftBar.append('div')
        .attr('id','leftSideBarContainer')
        .attr('data-colorchange',1)

    let infoRace=leftSideBarContainer.append('div')
        .attr('class','leftSideBarInfo')
    infoRace.html('')

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
        d3.selectAll('.leftSideBarInfo').style('color','black')
        infoRace.style('color','white')
        
        let mainMapPromise=new Promise((resolve,reject) => {
            trackUtils.addTrack(gpxList[i],map,[300,0],resolve)
        })
        mainMapPromise.then((object) => {
            let line=object[1]
            currentTrack=mapUtils.addPoint(line,map,0)
        })
    })
    leftSideBarContainer.on('mouseover',() => {
        if (leftSideBarContainer.attr('data-colorchange')==1) {
            leftSideBarContainer.style('background','rgba(10,10,10,0.6)')
        }
        leftSideBarContainer.style('cursor','pointer')
        infoRace.style('color','white')
    })
    leftSideBarContainer.on('mouseout',() => {
        if (leftSideBarContainer.attr('data-colorchange')==1) {
            leftSideBarContainer.style('background','rgba(255,255,255,0.01)')
            infoRace.style('color','black')
        }
        else {
            infoRace.style('color','white')
        }
    })


    // Add map in container

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
        trackUtils.addTrack(gpxList[i],leftSideBarMap,[0,0],resolve)
    })
    sideBarPromise.then((object) => {
        let track=object[0]
        const trackName=track._info.name
        infoRace.html(trackName)

        let line=object[1]
        mapUtils.addPoint(object[1],leftSideBarMap,1)
    })
}






