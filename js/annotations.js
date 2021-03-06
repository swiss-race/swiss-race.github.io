import * as d3 from 'd3'

/////  MAP ANNOTATIONS PROPERTIES   /////

let lineStyle = {
    "color": '#FF4F4F',
    "weight": 6,
    "opacity": 1.0,
}

let circleStyle = { color: 'red',
    fillOpacity:1,
    radius: 5,
    class: 1
}

// Define the div for the tooltip
let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("data-number",10)
    .style("opacity", 0);

let circle = L.circleMarker([-46.5, 6.8], circleStyle)

circle.on('mouseover', ()=> {
    mouseoverOpacity('circle'+circle.class.toString())
    circle.openPopup()
})
circle.on('mouseout', ()=> {
    mouseoutOpacity('circle'+circle.class.toString())
    circle.closePopup()
})

circle.bindPopup('Runner information');

let hideCircle = () => {
    circle.setStyle({'opacity':0,
        'fillOpacity':0,
        'pointer-events':'none'})
}
let showCircle = () => {
    circle.setStyle({'opacity':1,
        'fillOpacity':1,
        'pointer-events':'all'})
}

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


let runnersStyle = { color: 'red',
    opacity:1,
    fillOpacity:1,
    radius: 2,
    seconds:0,
    devX:0,
    devY:0,
    male:0,
    age:0,
    count:0,
}

let applyFilterToRunners = (runners,filterStatus) => {
    for (let i=0;i<runners.length;i++) {
        const runner=runners[i]
        let final_opacity = 0.65;
        let final_color = 'red';

        if (runner.male && (filterStatus.females_and_males || filterStatus.males_only)) {
            if (filterStatus.gender) final_color = '#49A8B1'
        }
        else if (runner.male==0 && (filterStatus.females_and_males || filterStatus.females_only)) {
            if (filterStatus.gender) final_color = '#CA6FA8'
        }
        else {
            final_opacity = 0
        }

        const age=runner.age
        if (age < 20 && (filterStatus.ages_all || filterStatus.ages_7_20)) {
          if (filterStatus.age) final_color =  "#89D863"
        }
        else if (age >= 20 && age < 33 && (filterStatus.ages_all || filterStatus.ages_20_33)) {
          if (filterStatus.age) final_color = "#3CC46C"
        }
        else if (age >= 33 && age < 47 && (filterStatus.ages_all || filterStatus.ages_33_47)) {
          if (filterStatus.age) final_color = "#49ABD1"
        }
        else if (age >= 47 && age < 60 && (filterStatus.ages_all || filterStatus.ages_47_60)) {
          if (filterStatus.age) final_color =  "#9267C4"
        }
        else if (age >= 60 && (filterStatus.ages_all || filterStatus.ages_60_)) {
          if (filterStatus.age) final_color = "#CA6FA8"
        }
        else {
          final_opacity = 0
        }

        const experience=runner.count
        if (experience == 1 && (filterStatus.count_all || filterStatus.count_1)) {
          if (filterStatus.experience)  final_color = "#79DA4A"
        }
        else if (experience >= 2 && experience <= 3 && (filterStatus.count_all || filterStatus.count_2_5)) {
          if (filterStatus.experience) final_color = "#00B9A6"
        }
        else if (experience >= 4 && (filterStatus.count_all || filterStatus.count_6)) {
          if (filterStatus.experience) final_color = "#CA6FA8"
        }
        else {
          final_opacity = 0
        }

        runner.setStyle({color:final_color, opacity:final_opacity,fillOpacity:final_opacity})
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

    let gender=d3.select('#genderClassifier').node().checked
    let age=d3.select('#ageClassifier').node().checked
    let experience=d3.select('#experienceClassifier').node().checked

    if (gender) document.getElementById("histogramTitle").innerHTML = "Distribution of Runner Positions by Gender";
    if (age) document.getElementById("histogramTitle").innerHTML = "Distribution of Runner Positions by Age";
    if (experience) document.getElementById("histogramTitle").innerHTML = "Distribution of Runner Positions by Experience";

    return {gender:gender,age:age,experience:experience,females_and_males:females_and_males,
        males_only:males_only,females_only:females_only,ages_all:ages_all,ages_60_:ages_60_,
        ages_7_20:ages_7_20,ages_33_47:ages_33_47,ages_20_33:ages_20_33,ages_47_60:ages_47_60,
        count_all:count_all,count_1:count_1,count_6:count_6,count_2_5:count_2_5}
}

let createRunnersCircles = (runnersData) => {

    let runnersCircles=[]
    let filterStatus=getFiltersStatus()
    for (let i=0;i<runnersData.length;i++) {
        let circle=L.circleMarker([46.5,6.8],runnersStyle)
        circle.seconds=runnersData[i][0]
        circle.devX=runnersData[i][1]
        circle.devY=runnersData[i][2]
        circle.male=runnersData[i][3]
        circle.age=runnersData[i][4]
        circle.count=runnersData[i][5]
        runnersCircles.push(circle)


    }
    applyFilterToRunners(runnersCircles,filterStatus)
    return runnersCircles
}

let setCirclesInPositions = (circles,positions) => {
    let filterStatus=getFiltersStatus()
    applyFilterToRunners(circles,filterStatus)
    for (let i=0;i<circles.length;i++) {
        circles[i].setLatLng([positions[i][0]+circles[i].devX,positions[i][1]+circles[i].devY])
    }
}

let addCirclesToMap = (circles,map) => {
    for (let i=0;i<circles.length;i++) {
        circles[i].addTo(map)
    }
}


export {lineStyle,div,circle,setCircleInPosition,mouseoverOpacity,mouseoutOpacity,createRunnersCircles,setCirclesInPositions,addCirclesToMap,showCircle,hideCircle,getFiltersStatus}
