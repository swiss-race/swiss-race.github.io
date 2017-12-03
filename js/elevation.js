import * as d3 from 'd3'
import * as annotations from './annotations.js'

/////  PLOT   /////

let addElevationPlot = (raceVector,circle) => {

    // Set div opacity to 1
    d3.select('#backgroundPlot').style('opacity',1)

    let dataset=[]
    for (let i=0;i<raceVector.length;i++) {
        dataset.push([raceVector[i].cumulativeDistance[0],raceVector[i].elevation[0],raceVector[i].coordinates[0][1],raceVector[i].coordinates[0][0],i])
    }

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
    let svg = d3.select("#plot").append("svg")
        .attr('id','elevationPlotSVG')
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
      });

    let bisect= d3.bisector(function(d) { return d[0]; }).left

    rect.on("mousemove", () => {
        let x0=xScale.invert(d3.mouse(d3.event.currentTarget)[0])
        let i=bisect(dataset,x0,1)
        const d=dataset[i-1]

        annotations.mouseoverOpacity('circle'+i.toString())
        annotations.div.transition()
            .duration(200)
            .style("opacity", 1);
        annotations.div.attr('data-number',i)

        annotations.div.html(d[0].toFixed(2)+'km' + "<br/>"  + d[1]+'m')
            .style("left", (d3.event.pageX+20) + "px")
            .style("top", (d3.event.pageY - 48) + "px");
        const latitude=d[2]
        const longitude=d[3]
        const index=d[4]
        annotations.setCircleInPosition(circle,index,d[1],latitude,longitude)
    });
}

    
export {addElevationPlot}
