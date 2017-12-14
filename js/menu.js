import * as d3 from 'd3'
import * as filters from './filters.js'
import * as annotations from './annotations.js'

let showLeftBar = (mainStatus) => {
    let leftBar=d3.select('#leftBar')
    leftBar.style('opacity',1)
    leftBar.style('pointer-events','all')
    mainStatus.leftBar=1
}

let hideLeftBar = (mainStatus) => {
    let leftBar=d3.select('#leftBar')
    leftBar.style('opacity',0)
    leftBar.style('pointer-events','none')
    mainStatus.leftBar=0
}

let showChangeViewButton = (content=0) => {
    let changeView=d3.select('#changeView')
    changeView.style('opacity',1)
    changeView.style('pointer-events','all')
    changeView.on('mouseover', () => {
        changeView.style('background','rgba(255,0,0,0.8)')
        changeView.style('color','white')
        changeView.style('cursor','pointer')
    })
    changeView.on('mouseout', () => {
        changeView.style('background','rgba(255,255,255,0.8)')
        changeView.style('color','red')
    })
    if (content==0) {
        // Runners view
        changeView.node().innerHTML='<img src="images/runners.png" alt="Mountain View" style="width:140px;height:130px;"> Runners View'
    } else {
        // Track view
        changeView.node().innerHTML='<img src="images/track.png" alt="Mountain View" style="width:140px;height:130px;"> Track View'
    }


        
}

let hideChangeViewButton = () => {
    let changeView=d3.select('#changeView')
    changeView.style('opacity',0)
    changeView.style('pointer-events','none')
}

let removeAllTrackView = (mainStatus,map) => {
    if (mainStatus.view==1) {
        map.removeLayer(mainStatus.currentTrack)
        mainStatus.currentTrack=0
        mainStatus.view=0
    }
    if (mainStatus.view==2) {
        map.removeLayer(mainStatus.currentTrack)
        mainStatus.currentTrack=0
        mainStatus.view=0
        if (mainStatus.currentPoints.length>0) {
            for (let i=0;i<mainStatus.currentPoints.length;i++) {
                map.removeLayer(mainStatus.currentPoints[i])
            }
            mainStatus.currentPoints.length=0
        }
    }
    annotations.hideCircle()
    d3.select('#elevationPlotSVG').remove()
    d3.select('#startButton').style('opacity',0)
        .style('pointer-events','none')
    d3.select('#stopButton').style('opacity',0)
        .style('pointer-events','none')
    d3.select('#backgroundPlot').style('opacity',0)

    hideLeftBar(mainStatus)
    hideChangeViewButton()

    filters.hideFilters()

}


export {showLeftBar,hideLeftBar,removeAllTrackView,showChangeViewButton}
