import * as d3 from 'd3'
import * as annotations from './annotations.js'


let showFilters = () => {
    let genderFilters=d3.select('#genderFilters')
    genderFilters.style('opacity',1)
    genderFilters.style('pointer-events','all')

    let ageFilters=d3.select('#ageFilters')
    ageFilters.style('opacity',1)
    ageFilters.style('pointer-events','all')

    let experienceFilters=d3.select('#experienceFilters')
    experienceFilters.style('opacity',1)
    experienceFilters.style('pointer-events','all')

    let classifiers=d3.select('#classifiers')
    classifiers.style('opacity',1)
    classifiers.style('pointer-events','all')

    let slideContainer=d3.select('#slidecontainer')
    slideContainer.style('opacity',1)
    slideContainer.style('pointer-events','all')
}

let showTimeContainer = () => {
    let timeContainer=d3.select('#time')
    timeContainer.style('opacity',1)
    return timeContainer
}

let hideFilters = () => {
    let genderFilters=d3.select('#genderFilters')
    genderFilters.style('opacity',0)
    genderFilters.style('pointer-events','none')

    let ageFilters=d3.select('#ageFilters')
    ageFilters.style('opacity',0)
    ageFilters.style('pointer-events','none')

    let experienceFilters=d3.select('#experienceFilters')
    experienceFilters.style('opacity',0)
    experienceFilters.style('pointer-events','none')

    let classifiers=d3.select('#classifiers')
    classifiers.style('opacity',0)
    classifiers.style('pointer-events','none')

    let slideContainer=d3.select('#slidecontainer')
    slideContainer.style('opacity',0)
    slideContainer.style('pointer-events','none')


    let timeContainer=d3.select('#time')
    timeContainer.style('opacity',0)
}


let runSimulation = (trackVector,runnersCircles,positionsArray,map) => {
    let timeContainer=d3.select('#time')
    let startFractionRace=[...new Array(runnersCircles.length)].map(x => 0)
    let timeStep=30
    let timeStart=new Date(0)
    let t=d3.interval(elapsed => {

        // 10 min = 1s
        let speedSlider=d3.select('#speed_slider').node()
        let increaseFactor=speedSlider.value*50
        let addTimer=increaseFactor*timeStep+timeStart.getTime()
        timeStart.setTime(addTimer)
        let seconds=timeStart.getSeconds()
        if (seconds<10)
            seconds='0'+seconds

        let timeString=(timeStart.getHours()-1+ 'h '+ timeStart.getMinutes()+':'+seconds)
        timeContainer.node().innerHTML=timeString


        let stopSimulation=true
        for (let i=0;i<runnersCircles.length;i++) {

            let totalTimeRunner=runnersCircles[i].seconds/increaseFactor
            let addTerm=timeStep/totalTimeRunner*trackVector[trackVector.length-1].cumulativeDistance/1000
            let fractionRace=startFractionRace[i] + addTerm
            startFractionRace[i]=fractionRace

            if (fractionRace<trackVector[trackVector.length-1].cumulativeDistance) {
                stopSimulation=false
            }

            for (let j=1;j<trackVector.length;j++) {
                if (trackVector[j].cumulativeDistance>fractionRace) {
                    let difference=fractionRace-trackVector[j-1].cumulativeDistance
                    let fraction=difference/(trackVector[j].cumulativeDistance-trackVector[j-1].cumulativeDistance)


                    let newLat=trackVector[j].coordinates[0][1]+fraction*(trackVector[j].coordinates[1][1]-trackVector[j].coordinates[0][1])
                    let newLng=trackVector[j].coordinates[0][0]+fraction*(trackVector[j].coordinates[1][0]-trackVector[j].coordinates[0][0])
                    positionsArray[i]=[newLat,newLng]
                    break
                }
            }
        }
        annotations.setCirclesInPositions(runnersCircles,positionsArray)
        annotations.addCirclesToMap(runnersCircles,map)

        if (stopSimulation) t.stop()
    },timeStep)
}

export {showFilters,showTimeContainer,hideFilters,runSimulation}