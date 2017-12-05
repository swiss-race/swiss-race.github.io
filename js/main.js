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
// import $ from 'jquery'
// window.$ = $;
// window.jQuery = jQuery;

// console.log(window.jQuery)
// console.log($)


// var top1 = $('#header').offset()
let lastPosition=0
window.onscroll = () => {
    let position=window.pageYOffset
    if(position>40 && lastPosition<position){
        d3.select('#header')
            .style('background','rgba(255,255,255,0.6)')
            .style('color','red')
        lastPosition=position
    
    } else {
        d3.select('#header')
            .style('background','rgba(255,0,0,0.8)')
            // .style('background-color','red')
            .style('color','white')
        lastPosition=position
    }
        
}

class MainStatus {
    constructor(view,leftBar,currentTrack=0) {
        this._view = view;
        this._leftBar = leftBar;
        this._currentTrack = currentTrack;
    }
    get view() {
        return this._view
    }
    set view(newView) {
        this._view=newView
    }
    get leftBar() {
        return this._leftBar
    }
    set leftBar(newLeftBar) {
        this._leftBar=newLeftBar
    }
}

let mainStatus=new MainStatus(0,0)
//
//////    ADD MAIN MAP   ////////
let map=mapUtils.getMap('map',{scrollWheelZoom:true})


let homeButton=d3.select('#homeButton')
homeButton.on('mouseover',() => {
    homeButton.style('cursor','pointer')
})
homeButton.on('mouseout',() => {
})
homeButton.on('click',() => {
    if (mainStatus.view==1) {
        map.removeLayer(mainStatus.currentTrack)
        mainStatus.currentTrack=0
        mainStatus.view=0
    }
    d3.select('#elevationPlotSVG').remove()
    d3.select('#backgroundPlot').style('opacity',0)
    d3.selectAll('#leftSideBarContainer')
        .attr('data-colorchange',1)
        .style('background','rgba(255,255,255,0.01')
    d3.selectAll('.leftSideBarInfo').style('color','red')
})

let raceButton=d3.select('#raceButton')
raceButton.on('mouseover',() => {
    let color=d3.select('#header').style('color')
    raceButton.style('border-bottom','2px solid '+color)
    raceButton.style('cursor','pointer')
})
raceButton.on('mouseout',() => {
    raceButton.style('border-bottom','0px')
})
raceButton.on('click',() => {
    let leftBar=d3.select('#leftBar')
    if (mainStatus.leftBar==0) {
        leftBar.style('opacity',1)
        leftBar.style('pointer-events','all')
        mainStatus.leftBar=1
    } else {
        leftBar.style('opacity',0)
        leftBar.style('pointer-events','none')
        mainStatus.leftBar=0
    }
})

////// ADD SIDE BAR //////
let gpxList=gpx_files.gpxList
let leftBar=d3.select('#leftBar')
const sheet=window.document.styleSheets[0]

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
        if (mainStatus.view==1) {
            map.removeLayer(mainStatus.currentTrack)
            mainStatus.currentTrack=0
            mainStatus.view=0
        }
        d3.select('#elevationPlotSVG').remove()
        d3.select('#backgroundPlot').style('opacity',0)
        d3.selectAll('#leftSideBarContainer')
            .attr('data-colorchange',1)
            .style('background','rgba(255,255,255,0.01')
        // leftSideBarContainer.style('background','rgba(0,0,255,0.6)')
        leftSideBarContainer.style('background','rgba(255,0,0,0.8)')
        leftSideBarContainer.attr('data-colorchange',0)
        d3.selectAll('.leftSideBarInfo').style('color','red')
        infoRace.style('color','white')
        
        let mainMapPromise=new Promise((resolve,reject) => {
            trackUtils.addTrack(gpxList[i],map,[400,0],resolve)
        })
        mainMapPromise.then((object) => {
            let line=object[1]
            let currentTrack=mapUtils.addPoint(line,map,0)
            mainStatus.view=1
            mainStatus.currentTrack=currentTrack
        })
    })
    leftSideBarContainer.on('mouseover',() => {
        if (leftSideBarContainer.attr('data-colorchange')==1) {
            leftSideBarContainer.style('background','rgba(255,0,0,0.8)')
        }
        leftSideBarContainer.style('cursor','pointer')
        infoRace.style('color','white')
    })
    leftSideBarContainer.on('mouseout',() => {
        if (leftSideBarContainer.attr('data-colorchange')==1) {
            leftSideBarContainer.style('background','rgba(255,255,255,0.01)')
            infoRace.style('color','red')
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






