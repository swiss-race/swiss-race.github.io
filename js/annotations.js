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

export {lineStyle,div,circle,setCircleInPosition,mouseoverOpacity,mouseoutOpacity}
