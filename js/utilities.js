
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

let distanceInKmBetweenEarthCoordinates = (lat1, lon1, lat2, lon2) => {
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
        raceElement.i=i
        race.push(raceElement)
    }

    return race
}

let transformToTrackVector = vector => {
    let race=[]

    for (let i=0;i<vector.length-1;i++) {
        let coordinates=[]
        let distances=0
        let cumulativeDistance=0

        // coordinates
        coordinates.push([vector[i].lng,vector[i].lat])
        coordinates.push([vector[i+1].lng,vector[i+1].lat])

        // distance
        const distance=distanceInKmBetweenEarthCoordinates(vector[i+1].lat,vector[i+1].lng,
                vector[i].lat,vector[i].lng)
        distances=distance
        if (i==0) {
            cumulativeDistance=distance
        } else {
            cumulativeDistance=distance+race[i-1].cumulativeDistance
        }

        // new element
        let raceElement={}
        raceElement.coordinates=coordinates
        raceElement.distances=distances
        raceElement.cumulativeDistance=cumulativeDistance
        raceElement.i=i
        race.push(raceElement)
    }
    return race
}

let numberRange = (start, end) => {
  return new Array(end - start).fill().map((d, i) => i + start);
}

export {distanceInKmBetweenEarthCoordinates,transformToGeoJSON,transformToTrackVector,numberRange}

