import * as d3 from 'd3'
import * as filters from './filters.js'

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

let showChangeViewButton = () => {
    let changeView=d3.select('#changeView')
    changeView.style('opacity',1)
    changeView.style('pointer-events','all')
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
        for (let i=0;i<mainStatus.currentPoints.length;i++) {
            map.removeLayer(mainStatus.currentPoints[i])
        }
        mainStatus.currentPoints.length=0
    }
    d3.select('#elevationPlotSVG').remove()
    d3.select('#backgroundPlot').style('opacity',0)

    hideLeftBar(mainStatus)
    hideChangeViewButton()

    filters.hideFilters()

}


export {showLeftBar,hideLeftBar,removeAllTrackView,showChangeViewButton}
