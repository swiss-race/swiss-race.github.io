// import * as d3 from 'd3'
// import './css/leaflet.css'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './gpx.js'
// import 'leaflet.elevation'
// import 'prova'
// import '/Users/savare/Dropbox/PhD/Courses/DataVisualization/Project/swiss-race.github.io/node_modules/leaflet/dist/leaflet.css'
// import get_text from './main.js'
// import "leaflet/dist/leaflet.css"
// import * as plugin from 'leaflet-plugins/layer/vector/GPX'
// import 'leaflet.elevation/dist/Leaflet.Elevation-0.0.2.min.js'


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
    // console.log(e.target.get_name())
    // console.log(e.target.get_distance())
    // console.log(e.target.get_total_time())
}).addTo(map);

//
let line=0

track.on('addline', e=> {
    line=e.line
    console.log(line._latlngs)
})

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
// map.on('click',mapClick)
