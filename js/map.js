// import * as d3 from 'd3'
// import * as L from 'leaflet'
import 'leaflet.elevation/dist/Leaflet.Elevation-0.0.2.min.js'


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





var marker = L.marker([46.5, 6.63]).addTo(map);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

circle.bindPopup("Circle");

let popup=L.popup()

let mapClick= e => {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked here")
        .openOn(map)
}

let halfMarathon=omnivore.gpx('gps_data/Demi-marathonLausanne.gpx')
// halfMarathon.addTo(map)

let el=L.control.elevation()
el.addTo(map)

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
    console.log(e.target.get_name())
    console.log(e.target.get_distance())
    console.log(e.target.get_total_time())
}).addTo(map);


let line=0

track.on('addline', e=> {
    line=e.line
    console.log(line._latlngs)
})

// track.on('addline', e => {
//     el.addData(e.line)
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

d3.select('body').append('p').text(track.get_total_time())


map.scrollWheelZoom.enable()
map.on('click',mapClick)
