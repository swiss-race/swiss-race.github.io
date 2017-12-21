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

/*let selectGender = () => {
    d3.select('#gender').node().checked=true
}
let selectAge = () => {
    d3.select('#age').node().checked=true
}
let selectCount = () => {
    d3.select('#experience').node().checked=true
}*/

let activateCallbackFilters = () => {
    let females_and_males=d3.select('#females_and_males')
    let males_only=d3.select('#males_only')
    let females_only=d3.select('#females_only')

    /*males_only.on('click',() => {
        selectGender()
    })
    females_only.on('click',() => {
        selectGender()
    })
    females_and_males.on('click',() => {
        selectGender()
    })*/

    let ages_all=d3.select('#ages_all')
    let ages_7_20=d3.select('#ages_7_20')
    let ages_20_33=d3.select('#ages_20_33')
    let ages_33_47=d3.select('#ages_33_47')
    let ages_47_60=d3.select('#ages_47_60')
    let ages_60_=d3.select('#ages_60_')
    /*ages_all.on('click',() => {
        selectAge()
    })
    ages_60_.on('click',() => {
        selectAge()
    })
    ages_7_20.on('click',() => {
        selectAge()
    })
    ages_47_60.on('click',() => {
        selectAge()
    })
    ages_20_33.on('click',() => {
        selectAge()
    })
    ages_33_47.on('click',() => {
        selectAge()
    })*/

    let count_all=d3.select('#count_all')
    let count_1=d3.select('#count_1')
    let count_2_5=d3.select('#count_2_5')
    let count_6=d3.select('#count_6')
    /*count_1.on('click',() => {
        selectCount()
    })
    count_all.on('click',() => {
        selectCount()
    })
    count_2_5.on('click',() => {
        selectCount()
    })
    count_6.on('click',() => {
        selectCount()
    })*/
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
        changeView.style('color','black')
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
    if (mainStatus.view==0) {
        for (let i=0;i<mainStatus.currentTracks.length;i++) {
            map.removeLayer(mainStatus.currentTracks[i])
        }
        mainStatus.currentTracks=0
        mainStatus.view=0
    }
    if (mainStatus.view==1) {
        map.removeLayer(mainStatus.currentTrack)
        mainStatus.currentTrack=0
        mainStatus.view=0
    }
    if (mainStatus.view==2) {
        map.removeLayer(mainStatus.currentTrackOutline)
        map.removeLayer(mainStatus.currentTrack)
        mainStatus.currentTrack=0
        mainStatus.view=0
        if (mainStatus.currentPoints.length>0) {
            for (let i=0;i<mainStatus.currentPoints.length;i++) {
                map.removeLayer(mainStatus.currentPoints[i])
            }
            mainStatus.currentPoints.length=0
        }
        if (mainStatus.binsList.length>0) {
            for (let i=0;i<mainStatus.binsList.length;i++) {
                mainStatus.binsList[i].remove()
            }
            mainStatus.binsList.length=0
        }
        d3.select('#histogramPlot').select('svg').remove()
        d3.select('#backgroundPlot').style('opacity',0)

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


export {showLeftBar,hideLeftBar,removeAllTrackView,showChangeViewButton,activateCallbackFilters}
