import * as d3 from 'd3'


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



export {showFilters,showTimeContainer,hideFilters}
