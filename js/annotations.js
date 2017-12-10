import * as d3 from 'd3'

/////  MAP ANNOTATIONS PROPERTIES   /////

let lineStyle = {
    "color": 'blue',
    "weight": 7,
    "opacity": 0.65
}

let circleStyle = { color: 'red',
    fillColor:'red',
    fillOpacity:1,
    radius: 5,
    class: 1
}

// Define the div for the tooltip
let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("data-number",10)
    .style("opacity", 0);

let circle = L.circleMarker([46.5, 6.8], circleStyle)

circle.on('mouseover', ()=> {
    mouseoverOpacity('circle'+circle.class.toString())
    circle.openPopup()
})
circle.on('mouseout', ()=> {
    mouseoutOpacity('circle'+circle.class.toString())
    circle.closePopup()
})
circle.bindPopup('Runner information');

let setCircleInPosition = (circle,index,elevation,latitude,longitude,map=0) => {
    circle.bringToFront()
    circle.setLatLng([latitude,longitude])
    circle.class=index
    circle._popup.setContent(elevation)
    if (map){
        circle.addTo(map)
    }
}

let mouseoverOpacity = className => {
    const previous_position=div.attr('data-number')
    mouseoutOpacity('circle'+previous_position.toString())
    div.transition()
        .duration(500)
        .style("opacity", 0);
    d3.select('.'+className)
        .style('opacity',1)
}

let mouseoutOpacity = className => {
    d3.select('.'+className)
        .style('opacity',0)
}


///////////////
/// Runners ///
let runnersStyle = { color: 'red',
    fillColor:'red',
    opacity:1,
    radius: 2,
    seconds:0,
    devX:0,
    devY:0,
    male:0,
    birth:0,
    count:0,
}

let applyFilterToRunner = runner => {
        if (runner.male) {
            runner.options.color="#49A8B1"
        } else {
            runner.options.color="#CA6FA8"
        }
}
 
let getFiltersStatus = () => {

    let females_and_males=d3.select('#females_and_males').node().checked
    let males_only=d3.select('#males_only').node().checked
    let females_only=d3.select('#females_only').node().checked

    let ages_all=d3.select('#ages_all').node().checked
    let ages_7_20=d3.select('#ages_7_20').node().checked
    let ages_20_33=d3.select('#ages_20_33').node().checked
    let ages_33_47=d3.select('#ages_33_47').node().checked
    let ages_47_60=d3.select('#ages_47_60').node().checked
    let ages_60_=d3.select('#ages_60_').node().checked

    let count_all=d3.select('#count_all').node().checked
    let count_1=d3.select('#count_1').node().checked
    let count_2_5=d3.select('#count_2_5').node().checked
    let count_6=d3.select('#count_6').node().checked


}

let createRunnersCircles = (runnersData) => {

    // let gender=document.getElementById('females_and_males')

    let runnersCircles=[]
    getFiltersStatus()
    for (let i=0;i<runnersData.length;i++) {
        let circle=L.circleMarker([46.5,6.8],runnersStyle)
        circle.seconds=runnersData[i][0]
        circle.devX=runnersData[i][1]
        circle.devY=runnersData[i][2]
        circle.male=runnersData[i][3]
        circle.birth=runnersData[i][4]
        circle.count=runnersData[i][5]
        applyFilterToRunner(circle)
        runnersCircles.push(circle)


    }
    return runnersCircles
}

let setCirclesInPositions = (circles,positions) => {
    getFiltersStatus()
    for (let i=0;i<circles.length;i++) {
        circles[i].setLatLng([positions[i][0]+circles[i].devX,positions[i][1]+circles[i].devY])
        applyFilterToRunner(circles[i])
        // if (circles[i].male) {
        //     circles[i].options.color="#49A8B1"
        // } else {
        //     circles[i].options.color="#CA6FA8"
        // }
    }
}

let addCirclesToMap = (circles,map) => {
    for (let i=0;i<circles.length;i++) {
        circles[i].addTo(map)
    }
}


export {lineStyle,div,circle,setCircleInPosition,mouseoverOpacity,mouseoutOpacity,createRunnersCircles,setCirclesInPositions,addCirclesToMap}
