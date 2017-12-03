
let disableMapInteractions= map => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    document.getElementById('map').style.cursor='default';
}

let getMap = (divName='map',params={}) => {
    // Initialize the map
    var map = L.map(divName, params)

    map.setView([46.905, 7.93], 8);

    // Adding all the possible layers
    var osmOrg=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.invalidateSize()


    return map
}

export {disableMapInteractions,getMap}
