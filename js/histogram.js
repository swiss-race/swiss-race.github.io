import * as d3 from 'd3'

let setUpHistogram = () => {
    // Set backgroundPlot 
    d3.select('#backgroundPlot').style('opacity',1)

    let svg=d3.select('#plot').append('svg')
    // let svg=d3.select('svg')
    svg.attr('position','absolute')
        .attr('left','0.5%')
        .attr('top','17%')
        .attr('width','99%')
        .attr('bottom','99%')

    // let histogram_margin = {top:  window.innerWidth * image_ratio + 5, right: -17, bottom: 20, left: 12};
    let histogram_margin = {top:  0 , right: -17, bottom: 20, left: 12};
    let histogram_width = +svg.attr("width") - histogram_margin.left - histogram_margin.right;
    let histogram_height = +svg.attr("height") - histogram_margin.top - histogram_margin.bottom;


    let x_axis = d3.scaleBand().rangeRound([0, histogram_width]).padding(0.1);
    let y_axis = d3.scaleLinear().rangeRound([histogram_height, 0]);

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("transform", "translate(" + histogram_margin.left + "," + histogram_margin.top + ")")
        .attr("fill", "#E7E5E6");

    var g = svg.append("g")
        .attr("transform", "translate(" + histogram_margin.left + "," + histogram_margin.top + ")");

    g.append("g")
        .attr("class", "axis_x")
        .attr("transform", "translate(0," + histogram_height + ")")
        .attr("stroke-width", "3px")
        .attr("stroke", "#B8B8B8")
        .attr("stroke-opacity", "0.45")
        .call(d3.axisBottom(x_axis).ticks());

    g.append("g")
        .attr("class", "axis_y")
        .attr("stroke-width", "3px")
        .attr("stroke-opacity", "0.45")
        .call(d3.axisLeft(y_axis).ticks(10, ""))
}

let computeHistogramData = (trackVector,runnersCircles) =>  {
    let numBins=75
    let bin_width = 1.0/num_bins
    let bin_counts = new Array(num_bins);

    for (i = 0; i < num_bins; i++) {
      bin_counts[i] = new Array(num_histograms).fill(0);
    }
    max_distance = marathon_distance / 60.0

    for (i = 0; i < runners_data.length; i++) {
      var t = runners_data[i][0]
      if (change_speed == true) {
        var shift = speedup * marathon_distance/(t + 1)
        distances_all_runners[i] = distances_all_runners[i] + shift
      }
      if (change_time == true) {
        distances_all_runners[i] =  runners_datastep * speedup * marathon_distance/(t + 1)
      }
      let distance = distances_all_runners[i] / 10

      let histogram_index = 0;
      if (gender_classifier) {
        if (runners_data[i][2] == 0)
          histogram_index = 1
      }
      if (age_classifier) {
        var age = runners_data[i][3]
        if (age < 20) histogram_index = 4
        if (age >= 20 && age < 33) histogram_index = 1
        if (age >= 33 && age < 47) histogram_index = 0
        if (age >= 47 && age < 60) histogram_index = 2
        if (age >= 60) histogram_index = 3
      }
      if (experience_classifier) {
        var experience = runners_data[i][4]
        if (experience == 1) histogram_index = 0
        if (experience >= 2 && experience <= 3) histogram_index = 1
        if (experience >= 4) histogram_index = 2
      }

      let normalized_distance = distance / max_distance
      let bin_index = Math.floor(normalized_distance / bin_width);
      if (bin_index > num_bins - 1) bin_index = num_bins - 1;
      bin_counts[bin_index][histogram_index] = bin_counts[bin_index][histogram_index] + 1.0;
    }

    histogram_data = new Array(num_bins * num_histograms);
    let max_value = 0;
    for (var j = 0; j < num_histograms; j++) {
      for (var i = 0; i < num_bins; i++) {
        let k = i + j * num_bins
        histogram_data[k] = new Array(3);
        histogram_data[k][0] = i;
        histogram_data[k][1] = bin_counts[i][j];
        histogram_data[k][2] = j;
        if (histogram_data[k][1] > max_value)
          max_value = histogram_data[k][1]
        }
    }
    for (var i = 0; i < num_bins * num_histograms; i++) {
      histogram_data[i][1] = histogram_data[i][1] / max_value
    }



}


export {setUpHistogram}
