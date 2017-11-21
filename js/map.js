// import * as d3 from 'd3'
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


// track.on('loaded', function(e) {
//   map.fitBounds(e.target.getBounds());
    // console.log(e.target.get_name())
    // console.log(e.target.get_distance())
    // console.log(e.target.get_total_time())
// }).addTo(map);

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


let transformToGeoJSON = vector => {
    let race = [{
        "type": "LineString"
    }];
    let coordinates=[]
    for (let i=0;i<vector.length;i++) {
        coordinates.push([vector[i].lng,vector[i].lat])
    }
    race[0].coordinates=coordinates

    return race
}

var geojson = {
"type": "FeatureCollection",
"features": [
{ "type": "Feature", "id": 0, "properties": { "name": "Example popup on mouse over"  }, "geometry": { "type": "Point", "coordinates": [ 6.9, 46.5 ] } }
]
};

let mouseMovePoint=L.geoJSON(geojson, {
    pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: function (feature, layer) {
        // layer.bindPopup(feature.properties.name);
        layer.on('mouseover', function (e) {
            this.setStyle({
                color:'red'
            })
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.setStyle({
                color:'green'
            })
            this.closePopup();
        });
    }
}).addTo(map)

let circle = L.circleMarker([46.5, 6.8], {
    color: 'red',
    fillColor:'red',
    fillOpacity:1,
    radius: 5
})

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
                circle.setLatLng([latitude,longitude])
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
}
track.on('addline', e=> {
    line=e.line
    addPoint(line)
})











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
