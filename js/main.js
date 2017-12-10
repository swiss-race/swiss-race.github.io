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
    constructor(view,leftBar,currentTrack=0,currentPoints=0) {
        this._view = view;
        this._leftBar = leftBar;
        this._currentTrack = currentTrack;
        this._currentPoints = currentPoints;
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
    get currentTrack() {
        return this._currentTrack
    }
    set currentTrack(newCurrentTrack) {
        this._currentTrack=newCurrentTrack
    }
    get currentPoints() {
        return this._currentPoints
    }
    set currentPoints(newCurrentPoints) {
        this._currentPoints=newCurrentPoints
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
        if (mainStatus.view==2) {
            map.removeLayer(mainStatus.currentTrack)
            mainStatus.currentTrack=0
            mainStatus.view=0
            for (let i=0;i<mainStatus.currentPoints.length;i++) {
                map.removeLayer(mainStatus.currentPoints[i])
            }
            mainStatus.currentPoints.length=0
        }
        leftBar.style('opacity',0)
        leftBar.style('pointer-events','none')
        mainStatus.leftBar=0

        d3.select('#elevationPlotSVG').remove()
        d3.select('#backgroundPlot').style('opacity',0)
        d3.selectAll('#leftSideBarContainer')
            .attr('data-colorchange',1)
            .style('background','rgba(255,255,255,0.01')
        leftSideBarContainer.style('background','rgba(255,0,0,0.8)')
        leftSideBarContainer.attr('data-colorchange',0)
        d3.selectAll('.leftSideBarInfo').style('color','red')
        infoRace.style('color','white')
        
        // Gender filters
        let genderFilters=d3.select('#genderFilters')
        genderFilters.style('opacity',1)
        genderFilters.style('pointer-events','all')


        // Add track 
        let mainMapPromise=new Promise((resolve,reject) => {
            trackUtils.addTrack(gpxList[i],map,[400,0],resolve)
        })
        // mainMapPromise.then((object) => {
        //     let line=object[1]
        //     let currentTrack=mapUtils.addPoint(line,map,0)
        //     mainStatus.view=1
        //     mainStatus.currentTrack=currentTrack
        // })
        
        // Add new moving points
        let sliderPromise=new Promise((resolve,reject) => {
            d3.csv('dataset/df_20kmLausanne_count.csv',(data) => {
                resolve(data)
            })
        })
        sliderPromise.then((object) => {
            let runnersData=parseRunners(object)
            let runnersCircles=drawRunners(runnersData)
            mainMapPromise.then((object) => {
                let track=object[1]._latlngs
                
                let trackJSON=utilities.transformToGeoJSON(track)
                let trackMap=L.geoJSON(trackJSON, {
                    style: annotations.lineStyle,
                }).addTo(map)
                mainStatus.currentTrack=trackMap
                mainStatus.view=2
                mainStatus.currentPoints=runnersCircles


                let trackVector=utilities.transformToTrackVector(track)
                const totalLength=trackVector[trackVector.length-1].cumulativeDistance
                let positionsArray=[]
                for (let i=0;i<runnersCircles.length;i++) {
                    positionsArray.push([track[0].lat,track[0].lng])
                }
                annotations.setCirclesInPositions(runnersCircles,positionsArray)
                annotations.addCirclesToMap(runnersCircles,map)
                let raceDuration=5000



                let t=d3.interval(elapsed => {

                    // 10 min = 1s
                    let increaseFactor=600
                    for (let i=0;i<runnersCircles.length;i++) {
                        let totalTimeRunner=runnersCircles[i].seconds/increaseFactor
                        let fractionRace=elapsed/totalTimeRunner*trackVector[trackVector.length-1].cumulativeDistance/1000

                        for (let j=1;j<trackVector.length;j++) {
                            if (trackVector[j].cumulativeDistance>fractionRace) {
                                let difference=fractionRace-trackVector[j-1].cumulativeDistance
                                let fraction=difference/(trackVector[j].cumulativeDistance-trackVector[j-1].cumulativeDistance)


                                let newLat=trackVector[j-1].coordinates[0][1]+fraction*(trackVector[j].coordinates[0][1]-trackVector[j-1].coordinates[0][1])
                                let newLng=trackVector[j-1].coordinates[0][0]+fraction*(trackVector[j].coordinates[0][0]-trackVector[j-1].coordinates[0][0])
                                positionsArray[i]=[newLat,newLng]
                                break
                            }
                        }
                    }
                    annotations.setCirclesInPositions(runnersCircles,positionsArray)
                    annotations.addCirclesToMap(runnersCircles,map)
                    if (elapsed>20000) t.stop()

                },30)
                annotations.setCirclesInPositions(runnersCircles,positionsArray)
                annotations.addCirclesToMap(runnersCircles,map)
                
            })
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

let parseRunners= (data) => {

    // std = track_width/2
    let stdX=0.002 // standard deviation in terms of latitude and longitude
    let stdY=0.003 // standard deviation in terms of latitude and longitude
    let runners_data = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
    runners_data[i] = new Array(5);
    }
    let distances_all_runners = new Array(data.length).fill(0);
    let time_all_runners = new Array(data.length).fill(0);

    let max_count = 0
    for (i = 0; i < data.length; i++) {
        let fist_split = data[i].Time.split(' ')[2]
        let second_split = fist_split.split(':');
        let hours = parseInt(second_split[0])
        let minutes = parseInt(second_split[1])
        let seconds = parseInt(second_split[2])
        seconds += 3600 * hours + 60 * minutes

        runners_data[i][0] = seconds
        runners_data[i][1] =(0.5 - Math.random()) * stdX
        runners_data[i][2] = (0.5 - Math.random()) * stdY
        // runners_data[i][1] = 0
        // runners_data[i][2] = 0
        if (data[i].Sex == "F") runners_data[i][3] = 0
        if (data[i].Sex == "M") runners_data[i][3] = 1
        runners_data[i][4] = data[i].RaceYear - data[i].Year
        runners_data[i][5] = data[i].Count
    }
    return runners_data
}

let drawRunners = (data) => {
    let subsampled_runners_data = [];
    let runners_fraction=1
    for (let i = 0; i < data.length; i++) {
        let fraction = runners_fraction / 100
        let r = Math.random();
        if (r < fraction)
            subsampled_runners_data.push(data[i])
    }
    let runnersCircles=annotations.createRunnersCircles(subsampled_runners_data)
    return runnersCircles
}

let animateMap = (elapsed) => {
    


}




