import * as d3 from 'd3'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './gpx.js'


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



// let text=get_text()
// console.log(text)


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

//
let line=0

var lineStyle = {
    "color": 'blue',
    "weight": 5,
    "opacity": 0.65
};

var geojsonMarkerOptions = {
    radius: 8,
    // fillColor: "#ff7800",
    color: 'green',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}

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
        const distance=distanceInKmBetweenEarthCoordinates(vector[i+1].lat,vector[i+1].lng,
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
        race.push(raceElement)
    }
    console.log(race)

    return race
}


/* let mouseMovePoint=L.geoJSON(geojson, { */
    // pointToLayer: (feature, latlng) => {
    //     return L.circleMarker(latlng, geojsonMarkerOptions);
    // },
    // onEachFeature: function (feature, layer) {
    //     // layer.bindPopup(feature.properties.name);
    //     layer.on('mouseover', function (e) {
    //         this.setStyle({
    //             color:'red'
    //         })
    //         this.openPopup();
    //     });
    //     layer.on('mouseout', function (e) {
    //         this.setStyle({
    //             color:'green'
    //         })
    //         this.closePopup();
    //     });
    // }
/* }).addTo(map) */

let circle = L.circleMarker([46.5, 6.8], {
    color: 'red',
    fillColor:'red',
    fillOpacity:1,
    radius: 5
})
circle.bindPopup('Runner information');

let addElevationPlot = raceVector => {
    let dataset=[]
    for (let i=0;i<raceVector.length;i++) {
        dataset.push([raceVector[i].cumulativeDistance[0],raceVector[i].elevation[0]])
    }
    console.log(dataset)

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const n=dataset.length

    // 5. X scale 
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset,d=>d[0])]) // input
        .range([0, width]); // output

    // 6. Y scale 
    const dataRange=d3.max(dataset,d=>d[1])-d3.min(dataset,d=>d[1])
    var yScale = d3.scaleLinear()
        .domain([d3.min(dataset,d=>d[1])-dataRange/10, d3.max(dataset,d=>d[1])+dataRange/10]) // input
        .range([height, 0]); // output

    // 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) { return xScale(d[0]); }) // set the x values for the line generator
        .y(function(d) { return yScale(d[1]); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
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

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // Add the scatterplot
    svg.selectAll("dot")
        .data(dataset)
    .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return xScale(d[0]); })
        .attr("cy", function(d) { return yScale(d[1]); })
        .style('opacity',.3)
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            console.log('here')
            div	.html((d[0]) + "<br/>"  + d[1])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

}
    
let addPoint = (line) => {
    // let svg=d3.select(map.getPanes().overlayPane).append('svg')
    // let g=svg.append('g').attr("class", "leaflet-zoom-hide");
    let pointArray=line._latlngs

    console.log(pointArray.length)
    let output=transformToGeoJSON(pointArray)

    console.log(output)
    L.geoJSON(output, {
        style: lineStyle,
        onEachFeature: (feature,layer)=> {
            // layer.bindPopup('Ciao')
            layer.on('mouseover', function (e) {
                this.setStyle({
                    color:'red'
                })
                this.openPopup();
            });
            layer.on('mousemove',e=>{
                let latitude=e.latlng.lat;
                let longitude=e.latlng.lng;
                // geojson.features[0].geometry.coordinates=[longitude,latitude]
                // mouseMovePoint.clearLayers()
                // mouseMovePoint.addData(geojson)
                // mouseMovePoint.setLatLngs([6.8,46.5])
                console.log(circle)
                circle.openPopup()
                circle.setLatLng([latitude,longitude])
                circle._popup.setContent(feature.elevation[0].toString())
                circle.addTo(map)
            
                layer.setStyle({
                    color:'blue'
                })
            }) 
            layer.on('mouseout', function (e) {
                this.setStyle({
                    color:'blue'
                })
                this.closePopup();
            });
        }
    }).addTo(map)

    addElevationPlot(output)

}
track.on('addline', e=> {
    line=e.line
    addPoint(line)
})




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


map.scrollWheelZoom.enable()
map.invalidateSize()
// map.on('click',mapClick)
