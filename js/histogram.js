import * as d3 from 'd3'
import * as annotations from './annotations.js'
import * as utilities from './utilities.js'

let numBins = 60
let numHistograms = 5
let histogramHeight = 200

let setUpHistogram = (histogramData) => {
    d3.select('#backgroundPlot').style('opacity',1)

    let svgContainer=d3.select('#histogramPlot').append('svg')

    svgContainer.attr('position','absolute')
        .attr('left','0%')
        .attr('top','0%')
        .attr('width','100%')
        .attr('height','200px')
        .style('background-color','white')

    let histogramWidth = 0.25 * window.innerWidth
    //let histogramHeight = 0.25 * window.innerHeight

    let binWidth = histogramWidth / numBins

    let binsList=[]
    for (var j = 0; j < numHistograms; j++) {
        for (var i = 0; i < numBins; i++) {
          let k = i + j * numBins
          let x = i * histogramWidth / numBins
          let bin=svgContainer.append('rect')
              .attr('width', binWidth - 1)
              .attr('height',  histogramHeight * histogramData[k][1])
              .attr('x', x)
              .attr('y', histogramHeight * (1 - histogramData[k][1]))
              .style('fill','white')
          binsList.push(bin)
        }
    }
    return binsList
  }

let computeHistogramData = (trackVector,runnersCircles,positionsArray) =>  {

    let bin_width = 1.0/numBins
    let bin_counts = new Array(numBins);
    let filterStatus=annotations.getFiltersStatus()
    let trackLength=trackVector[trackVector.length-1].cumulativeDistance

    for (i = 0; i < numBins; i++) {
      bin_counts[i] = new Array(numHistograms).fill(0);
    }
    // max_distance = marathon_distance / 60.0

    for (i = 0; i < runnersCircles.length; i++) {
      // var t = runners_data[i][0]
      // if (change_speed == true) {
      //   var shift = speedup * marathon_distance/(t + 1)
      //   distances_all_runners[i] = distances_all_runners[i] + shift
      // }
      // if (change_time == true) {
      //   distances_all_runners[i] =  runners_datastep * speedup * marathon_distance/(t + 1)
      // }
      // let distance = distances_all_runners[i] / 10

      let histogram_index;
      if (filterStatus.gender) {
        if (!runnersCircles[i].male) histogram_index = 4
        if (runnersCircles[i].male) histogram_index = 3
      }
      if (filterStatus.age) {
        var age = runnersCircles[i].age
        if (age < 20) histogram_index = 4
        if (age >= 20 && age < 33) histogram_index = 1
        if (age >= 33 && age < 47) histogram_index = 0
        if (age >= 47 && age < 60) histogram_index = 2
        if (age >= 60) histogram_index = 3
      }
      if (filterStatus.experience) {
        var experience = runnersCircles[i].count
        if (experience == 1) histogram_index = 2
        if (experience >= 2 && experience <= 3) histogram_index = 3
        if (experience >= 4) histogram_index = 4
      }

      let normalized_distance = positionsArray[i][2]/trackLength * numBins
      let bin_index = Math.floor(normalized_distance);
      if (bin_index > numBins - 1) bin_index = numBins - 1;
      bin_counts[bin_index][histogram_index] = bin_counts[bin_index][histogram_index] + 1.0;
    }

    let histogram_data = new Array(numBins * numHistograms);
    let max_value = 0;
    for (var j = 0; j < numHistograms; j++) {
      for (var i = 0; i < numBins; i++) {
        let k = i + j * numBins
        histogram_data[k] = new Array(3);
        histogram_data[k][0] = i;
        histogram_data[k][1] = bin_counts[i][j];
        histogram_data[k][2] = j;
        if (histogram_data[k][1] > max_value)
          max_value = histogram_data[k][1]
        }
    }
    for (var i = 0; i < numBins * numHistograms; i++) {
      histogram_data[i][1] = histogram_data[i][1] / max_value
    }

    // console.log(histogram_data)

    return histogram_data

}

let updateHistogram = (trackVector,runnersCircles,binsList,positionsArray) =>  {

  if (!runnersCircles.length){
      return
  }

  let histogramData = computeHistogramData(trackVector,runnersCircles,positionsArray)
  let filterStatus = annotations.getFiltersStatus()

  let histogramWidth = 0.25 * window.innerWidth
  for (var j = 0; j < numHistograms; j++) {
      for (var i = 0; i < numBins; i++) {
        let k = i + j * numBins
        let bin = binsList[k]
        let x = i * histogramWidth / numBins
        bin.attr('height', histogramHeight * histogramData[k][1])
        bin.attr('x', x)
        bin.attr('y',  histogramHeight * (1 - histogramData[k][1]))

        let histIndex = j

        var color;
        if (filterStatus.gender && histIndex == 0) color = "#FFFFFF"
        if (filterStatus.gender && histIndex == 1) color = "#FFFFFF"
        if (filterStatus.gender && histIndex == 2) color = "#FFFFFF"
        if (filterStatus.gender && histIndex == 3) color = "#49ABD1"
        if (filterStatus.gender && histIndex == 4) color = "#CA6FA8"

        if (filterStatus.age && histIndex == 4) color = "#89D863"
        if (filterStatus.age && histIndex == 1) color = "#3CC46C"
        if (filterStatus.age && histIndex == 0) color = "#49ABD1"
        if (filterStatus.age && histIndex == 2) color = "#9267C4"
        if (filterStatus.age && histIndex == 3) color = "#CA6FA8"

        if (filterStatus.experience && histIndex == 0) color = "#FFFFFF"
        if (filterStatus.experience && histIndex == 1) color = "#FFFFFF"
        if (filterStatus.experience && histIndex == 2) color = "#79DA4A"
        if (filterStatus.experience && histIndex == 3) color = "#00B9A6"
        if (filterStatus.experience && histIndex == 4) color = "#CA6FA8"
        bin.style('fill', color)
      }
    }
}

export {setUpHistogram,updateHistogram, computeHistogramData}
