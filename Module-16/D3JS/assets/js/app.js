// Unit 16 Assigment - Data Journalism and D3
// @version 1.0
// @author Martha Meses

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("viewBox", `0 0 960 500`);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("/assets/data/data.csv")
  .then(function(healthRisksData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthRisksData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.povety = +data.poverty;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.healthcare = +data.healttcare;

    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      // .domain([20, d3.max(healthRisksData, d => d.age)])
      // .domain([20, d3.max(healthRisksData, d => d.poverty)])
      .domain([80, d3.max(healthRisksData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      // .domain([0, 2 + d3.max(healthRisksData, d => d.smokes)])
      // .domain([0, 2 + d3.max(healthRisksData, d => d.healthcare)])
      .domain([20, 2 + d3.max(healthRisksData, d => d.obesity)])      
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    
    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
      
    //Define the data for the circles
    var info = svg.selectAll("g")
        .data(healthRisksData)

    //Create and place the "blocks" containing the circle and the text
    var blockCT = info.enter()
        .append("g")
        .attr("transform", function(d){return "translate("+xLinearScale(d.income)+","+yLinearScale(d.obesity)+")"});

    //Create the circle for each block
    var circlesGroup = blockCT.append("circle")
        .attr("r", "15")
        .attr("fill", "#17BEBB")
        .attr("opacity", ".5")
        .style("stroke", "#17BEBB")

    //Create the text for each block 
    blockCT.append("text")
        .attr("class", "circle-text")
        .attr("dx", function(d){return -7})
        .attr("dy", function(d){return 5})
        .text(function(d){return d.abbr});

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`<b>${d.state}</b><br>Age: <b>${d.income}</b><br>Smokes: <b>${d.obesity}%</b>`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
      d3.select(this).attr("fill", "#FF3C38").attr("opacity", "1").style("stroke", "#FF3C38");
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
        d3.select(this).attr("fill", "#17BEBB").attr("opacity", ".5").style("stroke", "#17BEBB");
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.6))
      .attr("dy", "1em")
      .attr("class", "axisText")
      // .text("Smokes (%)");
      // .text("Lacks Healthcare (%)");
      .text("Obesity (%)");


    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      // .text("Age (Median)");
      // .text("In Poverty (%)");
      .text("Household Income (Median)");

  });

