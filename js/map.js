import * as d3 from 'd3'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './gpx.js'
import * as utilities from './utilities.js'

//////    ADD MAP   ////////
// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: false
});

// Set the position and zoom level of the map
map.setView([46.505, 6.63], 13);

// Adding all the possible layers
var osmOrg=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.scrollWheelZoom.enable()
map.invalidateSize()

var gpx = 'gps_data/Demi-marathonLausanne.gpx' // URL to your GPX file or the GPX itself
let track=new L.GPX(gpx,
    {
        async: true,
        marker_options: {
            startIconUrl: 'images/pin-icon-start.png',
            endIconUrl: 'images/pin-icon-end.png',
            shadowUrl: 'images/pin-shadow.png'
  }})


track.on('loaded', function(e) {
  map.fitBounds(e.target.getBounds());
  //   console.log(e.target.get_name())
  //   console.log(e.target.get_distance())
  //   console.log(e.target.get_total_time())
})

track.on('addline', e=> {
    let line=e.line
    addPoint(line)
})

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

let setCircleInPosition = (circle,index,elevation,latitude,longitude) => {
    // console.log('circle set in position'+latitude)
    circle.setLatLng([latitude,longitude])
    circle.class=index
    circle._popup.setContent(elevation)
    circle.addTo(map)
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

/////  PLOT   /////

let addElevationPlot = raceVector => {
    console.log(raceVector)
    let dataset=[]
    for (let i=0;i<raceVector.length;i++) {
        dataset.push([raceVector[i].cumulativeDistance[0],raceVector[i].elevation[0],raceVector[i].coordinates[0][1],raceVector[i].coordinates[0][0],i])
    }
    console.log(dataset)

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 500 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    const n=dataset.length

    // 5. X scale 
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset,d=>d[0])]) // input
        .range([0, width]); // output

    // 6. Y scale 
    const dataRange=d3.max(dataset,d=>d[1])-d3.min(dataset,d=>d[1])
    let yScale = d3.scaleLinear()
        .domain([d3.min(dataset,d=>d[1])-dataRange/10, d3.max(dataset,d=>d[1])+dataRange/10]) // input
        .range([height, 0]); // output

    // 7. d3's line generator
    let line = d3.line()
        .x(function(d, i) { return xScale(d[0]); }) // set the x values for the line generator
        .y(function(d) { return yScale(d[1]); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataset) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator

    // Labels
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Distance")
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Elevation")

    // Add the scatterplot
    svg.selectAll('aaascasc').data(dataset)
    .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return xScale(d[0]); })
        .attr("cy", function(d) { return yScale(d[1]); })
        .attr("class",(d,i) => {return 'circle'+i.toString()})
        .style('opacity',0)
        
    let rect=svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() {  })
      .on("mouseout", function() { 
          // console.log('MOUSEOUT')
      });

    let bisect= d3.bisector(function(d) { return d[0]; }).left

    rect.on("mousemove", () => {
        let x0=xScale.invert(d3.mouse(d3.event.currentTarget)[0])
        let i=bisect(dataset,x0,1)
        const d=dataset[i-1]

        mouseoverOpacity('circle'+i.toString())
        div.transition()
            .duration(200)
            .style("opacity", 1);
        div.attr('data-number',i)

        div	.html(d[0].toFixed(2)+'km' + "<br/>"  + d[1]+'m')
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        const latitude=d[2]
        const longitude=d[3]
        const index=d[4]
        setCircleInPosition(circle,index,d[1],latitude,longitude)
        // let d=
    });
}

    
////  DISPLAY TRACK   ////

let transformToGeoJSON = vector => {
    let race=[]

    for (let i=0;i<vector.length-1;i++) {
        let coordinates=[]
        let distances=[]
        let cumulativeDistance=[]
        let elevation=[]

        // coordinates
        coordinates.push([vector[i].lng,vector[i].lat])
        coordinates.push([vector[i+1].lng,vector[i+1].lat])

        // distance
        const distance=utilities.distanceInKmBetweenEarthCoordinates(vector[i+1].lat,vector[i+1].lng,
                vector[i].lat,vector[i].lng)
        distances.push(distance)
        if (i==0) {
            cumulativeDistance.push(distance)
        } else {
            cumulativeDistance.push(distance+race[i-1].cumulativeDistance[0])
        }

        // elevation
        elevation.push(vector[i].meta.ele)

        // new element
        let raceElement={}
        raceElement.type='LineString'
        raceElement.coordinates=coordinates
        raceElement.distances=distances
        raceElement.cumulativeDistance=cumulativeDistance
        raceElement.elevation=elevation
        raceElement.i=i
        race.push(raceElement)
    }
    console.log(race)

    return race
}


let addPoint = (line) => {
    let pointArray=line._latlngs

    let output=transformToGeoJSON(pointArray)

    console.log(output)
    L.geoJSON(output, {
        style: lineStyle,
        onEachFeature: (feature,layer)=> {
            // layer.bindPopup('Ciao')
            layer.on('mouseover', function (e) {
                // Change elevation plot
                const index=feature.i
                const className='circle'+index.toString()

                let latitude=e.latlng.lat;
                let longitude=e.latlng.lng;
                
                let elevation=feature.elevation[0].toString()
     
                setCircleInPosition(circle,index,elevation,latitude,longitude)

            });
            
            layer.on('mouseout', function (e) {
                // this.setStyle({
                //     color:'blue'
                // })
                // this.closePopup();


                // const index=feature.i
                // const className='circle'+index.toString()
                // mouseoutOpacity(className)
            });
        }
    }).addTo(map)

    addElevationPlot(output)

}




/* let plot=d3.select('body').append('svg') */
//     .attr('width',960)
//     .attr('height',500)
// let container=plot.append("g").attr("transform", "translate(20,20)")
// container.append("rect")
//                .attr("width", 920)
//                .attr("height", 460);
//
//
// const scale=d3.scaleLinear()
//     .domain([0,22000])
    /* .range([300,500]) */






// L.GridLayer.DebugCoords = L.GridLayer.extend({
//     createTile: function (coords) {
//         var tile = document.createElement('div');
//         tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
//         tile.style.outline = '1px solid red';
//         return tile;
//     }
// });
//
// L.gridLayer.debugCoords = function(opts) {
//     return new L.GridLayer.DebugCoords(opts);
// };
//
// map.addLayer( L.gridLayer.debugCoords() );


// let el=L.control.elevation()
// el.addTo(map)

// track.on('addline', e => {
//     console.log(e.line)
// })

// var g=new L.GPX("gps_data/Demi-marathonLausanne.gpx", {async: true});
// g.on("addline",function(e){
//     el.addData(e.line);
// });
// g.on("addline",function(e){
//     el.addData(e.line);
// });
// g.addTo(map);
//

// d3.select('body').append('p').text(track.get_total_time())


// map.on('click',mapClick)
