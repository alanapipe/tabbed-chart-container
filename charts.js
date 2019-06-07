var outerWidth = 620,
      outerHeight = 400;

      var fundFireColors = [ '#990000','#FF9933', '#006666', '#99CC33', '#009999','#006699', '#CC0000'],
        agendaColors = ['#98002E'],
        // , '#582700', '#336699', '#996600', '#003366',  '#004F24', '#759900','#646569'
        ignitesColors = [ '#E61C3A', '#F06100', '#B2651F', '#004F24', '#70B5D3', '#EDC55B', '#807A89'],
        boardIqColors = ['#0F004E','#EC881D','#783300','#339999'],
        mandateWireColors = ['#7EA0C3', '#E09859', '#93B595', '#B297AF'];

    let publicationColors = agendaColors;
    let xAxisLabel = 'Pay ratio';
    let yAxisLabel = 'Annual revenue (B)';
    let sourceText = 'Source: Equilar';

    //tooltip will populate whatever is in the column 'name' --> edit on line 168
    //to change axis value labels, edit lines 71-102
    //edit TICK FORMAT on line 132

    // make variable for margins to easily move the axes/ differentiate between inner and outer
    var margin = {
      top: 25,
      left: 50,
      right: 50,
      bottom: 50
    };

    //declare the inner width of just the chart (just call it width) and define it in relation to the margins we made
    var width = outerWidth - margin.left - margin.right,
      height = outerHeight - margin.top - margin.bottom;


    //create a linear scale for the x coordinates
    var xScale = d3.scaleLinear()
      .range([0, width]);

    //create a linear scale for the y coordinates, and put the larger number (height variable) first so that the y axis will flip
    var yScale = d3.scaleLinear()
      .range([height, 0]);

    // create a square root scale so that the radii of squares take up the right amount of space
    var radiusScale = d3.scaleSqrt()
      .range([3, 25]);

    //create an ordinal scale and fill it with colors. the colors can be assigned one by one to specified categories. storing schemes in a variable here.
    var colorScale = d3.scaleOrdinal()
      .range(publicationColors);


// CYCLICALS

    // LOAD THE DATA --> the data is stored in a "dictionary" the + is to turn the row names into strings? or strings to js
    d3.csv("data/cyclicals.csv", function(err, csvData) {
      csvData.forEach(function(row) {
        //EDIT for x axis values
        row.xAxisColumn = +row.xAxisColumn;
        //EDIT for y axis values
        row.yAxisColumn = +row.yAxisColumn;
        //EDIT for radius values
        row.radialColumn = +row.radialColumn;
        //edit if filtering numeric data
        // row.company = +row.company;
      });

      //pass it the variable that will become the xAxis
      var xAxisValues = csvData.map(function(row) {
        return row.xAxisColumn;
      });

      // pass it the variable that will become Y axis
      var yAxisValues = csvData.map(function(row) {
        return row.yAxisColumn;
      });

      // extract the population data
      var radiusValues = csvData.map(function(row) {
        return row.radialColumn;
      });

      //set the domain of the linear x scale to be the extent (lowest and highest) datapoints
      // xScale.domain(d3.extent(xAxisValues));
      xScale.domain([0,2508]);

      //ADJUST MAX AND MIN OF Y AXIS
      yScale.domain([0, 265.6]);

      //ADJUST SIZE OF BUBBLES
      radiusScale.domain([0.388968, 108.295023]);

      var svg = d3.select("#cyclicals")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

        //HERE"S WHERE TO START EDITING THE TOOLTIP

      var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip-style")
        .style('opacity',0);

      var yAxis = d3.axisLeft(yScale)
      .tickFormat(function(value){
        return '$'+value;
      });

      var yAxisContainer = svg.append("g");

      // EDIT THE TICK FORMAT HERE
      var xAxis = d3.axisBottom(xScale)
        .tickFormat(function(value) {
          return value;
          // return ["$"] + value + "suffix";
        });

      var xAxisContainer = svg.append("g")
        .attr("transform", "translate(0 " + height + ")");

      //yAxis(yAxisContainer);
      yAxisContainer.call(yAxis);

      //xAxis(xAxisContainer);
      xAxisContainer.call(xAxis);

      //ADJUST scatter dot here
      csvData.forEach(function(row) {
        svg.append("circle")
        .datum(row)
          .attr("r", function(d) {
            return radiusScale(d.radialColumn);
          });

      });

      // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height +margin.top+10) + ")")
      .style("text-anchor", "middle")
      .text(xAxisLabel)
      .attr('class','axisLabel');

      // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisLabel)
            .attr('class','axisLabel');

      var circles = svg.selectAll("circle")
        .attr("cx", function(d) {
          return xScale(d.xAxisColumn);
        })
        .attr("cy", function(d) {
          return yScale(d.yAxisColumn);
        })
        .attr("fill", function(d) {
          return colorScale(d.seriesColor);
        })
        .attr('opacity', '0.5')
        .on("mouseout", function(d) {
          tooltip.text(defaultTooltip);
          d3.select(this)
          .attr("stroke", "none")
          ;
        })
      //this is still in reference to circles, not to tooltip, which lives in css
        .on('mouseout', function(d){
        div.transition()
        .duration(1000)
        .style('opacity',0)
        d3.select(this)
        .attr('stroke','none')
        .attr('fill', '#98002E')
        ;
      })
      //showw css when hover on circles
        .on('mouseover', function(d){
        d3.select(this)
        .attr('stroke', 'white')
        .attr('fill', '#582700')
        div.transition()
        .duration(200)
        .attr('stroke-width', '5')
        .style("opacity", 1)
        div.text(d.company+' CEO, '+d.name+' earned $'+ d.radialColumn+' M in 2018.')
        .style("left", (d3.event.pageX -20) + "px")
                .style("top",(d3.event.pageY-100 ) + "px");
  })

      var sourceLabel = d3.select("#cyclicals")
          .append("div")
          .attr("class", "sourceLabel")
          .text(sourceText)
    })


// TECHNOLOGY
// LOAD THE DATA --> the data is stored in a "dictionary" the + is to turn the row names into strings? or strings to js
d3.csv("data/technology.csv", function(err, csvData) {
  csvData.forEach(function(row) {
    //EDIT for x axis values
    row.xAxisColumn = +row.xAxisColumn;
    //EDIT for y axis values
    row.yAxisColumn = +row.yAxisColumn;
    //EDIT for radius values
    row.radialColumn = +row.radialColumn;
    //edit if filtering numeric data
    // row.company = +row.company;
  });

  //pass it the variable that will become the xAxis
  var xAxisValues = csvData.map(function(row) {
    return row.xAxisColumn;
  });

  // pass it the variable that will become Y axis
  var yAxisValues = csvData.map(function(row) {
    return row.yAxisColumn;
  });

  // extract the population data
  var radiusValues = csvData.map(function(row) {
    return row.radialColumn;
  });

  //set the domain of the linear x scale to be the extent (lowest and highest) datapoints
  // xScale.domain(d3.extent(xAxisValues));
  xScale.domain([0,2508]);

  //ADJUST MAX AND MIN OF Y AXIS
  yScale.domain([0, 265.6]);

  //ADJUST SIZE OF BUBBLES
  radiusScale.domain([0.388968, 108.295023]);

  var svg = d3.select("#technology")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

    //HERE"S WHERE TO START EDITING THE TOOLTIP

  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip-style")
    .style('opacity',0);

  var yAxis = d3.axisLeft(yScale)
  .tickFormat(function(value){
    return '$'+value;
  });

  var yAxisContainer = svg.append("g");

  // EDIT THE TICK FORMAT HERE
  var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(value) {
      return value;
      // return ["$"] + value + "suffix";
    });

  var xAxisContainer = svg.append("g")
    .attr("transform", "translate(0 " + height + ")");

  //yAxis(yAxisContainer);
  yAxisContainer.call(yAxis);

  //xAxis(xAxisContainer);
  xAxisContainer.call(xAxis);

  //ADJUST scatter dot here
  csvData.forEach(function(row) {
    svg.append("circle")
    .datum(row)
      .attr("r", function(d) {
        return radiusScale(d.radialColumn);
      });

  });

  // text label for the x axis
svg.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height +margin.top+10) + ")")
  .style("text-anchor", "middle")
  .text(xAxisLabel)
  .attr('class','axisLabel');

  // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel)
        .attr('class','axisLabel');

  var circles = svg.selectAll("circle")
    .attr("cx", function(d) {
      return xScale(d.xAxisColumn);
    })
    .attr("cy", function(d) {
      return yScale(d.yAxisColumn);
    })
    .attr("fill", function(d) {
      return colorScale(d.seriesColor);
    })
    .attr('opacity', '0.5')
    .on("mouseout", function(d) {
      tooltip.text(defaultTooltip);
      d3.select(this)
      .attr("stroke", "none")
      ;
    })
  //this is still in reference to circles, not to tooltip, which lives in css
    .on('mouseout', function(d){
    div.transition()
    .duration(1000)
    .style('opacity',0)
    d3.select(this)
    .attr('stroke','none')
    .attr('fill', '#98002E')
    ;
  })
  //showw css when hover on circles
    .on('mouseover', function(d){
    d3.select(this)
    .attr('stroke', 'white')
    .attr('fill', '#582700')
    div.transition()
    .duration(200)
    .attr('stroke-width', '5')
    .style("opacity", 1)
    div.text(d.company+' CEO, '+d.name+' earned $'+ d.radialColumn+' M in 2018.')
    .style("left", (d3.event.pageX -20) + "px")
            .style("top",(d3.event.pageY-100 ) + "px");
})

  var sourceLabel = d3.select("#technology")
      .append("div")
      .attr("class", "sourceLabel")
      .text(sourceText)
})

// DEFENSIVE
    // LOAD THE DATA --> the data is stored in a "dictionary" the + is to turn the row names into strings? or strings to js
    d3.csv("data/defensive.csv", function(err, csvData) {
      csvData.forEach(function(row) {
        //EDIT for x axis values
        row.xAxisColumn = +row.xAxisColumn;
        //EDIT for y axis values
        row.yAxisColumn = +row.yAxisColumn;
        //EDIT for radius values
        row.radialColumn = +row.radialColumn;
        //edit if filtering numeric data
        // row.company = +row.company;
      });

      //pass it the variable that will become the xAxis
      var xAxisValues = csvData.map(function(row) {
        return row.xAxisColumn;
      });

      // pass it the variable that will become Y axis
      var yAxisValues = csvData.map(function(row) {
        return row.yAxisColumn;
      });

      // extract the population data
      var radiusValues = csvData.map(function(row) {
        return row.radialColumn;
      });

      //set the domain of the linear x scale to be the extent (lowest and highest) datapoints
      // xScale.domain(d3.extent(xAxisValues));
      xScale.domain([0,2508]);

      //ADJUST MAX AND MIN OF Y AXIS
      yScale.domain([0, 265.6]);

      //ADJUST SIZE OF BUBBLES
      radiusScale.domain([0.388968, 108.295023]);

      var svg = d3.select("#defensive")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

        //HERE"S WHERE TO START EDITING THE TOOLTIP

      var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip-style")
        .style('opacity',0);

      var yAxis = d3.axisLeft(yScale)
      .tickFormat(function(value){
        return '$'+value;
      });

      var yAxisContainer = svg.append("g");

      // EDIT THE TICK FORMAT HERE
      var xAxis = d3.axisBottom(xScale)
        .tickFormat(function(value) {
          return value;
          // return ["$"] + value + "suffix";
        });

      var xAxisContainer = svg.append("g")
        .attr("transform", "translate(0 " + height + ")");

      //yAxis(yAxisContainer);
      yAxisContainer.call(yAxis);

      //xAxis(xAxisContainer);
      xAxisContainer.call(xAxis);

      //ADJUST scatter dot here
      csvData.forEach(function(row) {
        svg.append("circle")
        .datum(row)
          .attr("r", function(d) {
            return radiusScale(d.radialColumn);
          });

      });

      // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height +margin.top+10) + ")")
      .style("text-anchor", "middle")
      .text(xAxisLabel)
      .attr('class','axisLabel');

      // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisLabel)
            .attr('class','axisLabel');

      var circles = svg.selectAll("circle")
        .attr("cx", function(d) {
          return xScale(d.xAxisColumn);
        })
        .attr("cy", function(d) {
          return yScale(d.yAxisColumn);
        })
        .attr("fill", function(d) {
          return colorScale(d.seriesColor);
        })
        .attr('opacity', '0.5')
        .on("mouseout", function(d) {
          tooltip.text(defaultTooltip);
          d3.select(this)
          .attr("stroke", "none")
          ;
        })
      //this is still in reference to circles, not to tooltip, which lives in css
        .on('mouseout', function(d){
        div.transition()
        .duration(1000)
        .style('opacity',0)
        d3.select(this)
        .attr('stroke','none')
        .attr('fill', '#98002E')
        ;
      })
      //showw css when hover on circles
        .on('mouseover', function(d){
        d3.select(this)
        .attr('stroke', 'white')
        .attr('fill', '#582700')
        div.transition()
        .duration(200)
        .attr('stroke-width', '5')
        .style("opacity", 1)
        div.text(d.company+' CEO, '+d.name+' earned $'+ d.radialColumn+' M in 2018.')
        .style("left", (d3.event.pageX -20) + "px")
                .style("top",(d3.event.pageY-100 ) + "px");
  })

      var sourceLabel = d3.select("#defensive")
          .append("div")
          .attr("class", "sourceLabel")
          .text(sourceText)
    })

// ENERGY
// LOAD THE DATA --> the data is stored in a "dictionary" the + is to turn the row names into strings? or strings to js
d3.csv("data/energy.csv", function(err, csvData) {
  csvData.forEach(function(row) {
    //EDIT for x axis values
    row.xAxisColumn = +row.xAxisColumn;
    //EDIT for y axis values
    row.yAxisColumn = +row.yAxisColumn;
    //EDIT for radius values
    row.radialColumn = +row.radialColumn;
    //edit if filtering numeric data
    // row.company = +row.company;
  });

  //pass it the variable that will become the xAxis
  var xAxisValues = csvData.map(function(row) {
    return row.xAxisColumn;
  });

  // pass it the variable that will become Y axis
  var yAxisValues = csvData.map(function(row) {
    return row.yAxisColumn;
  });

  // extract the population data
  var radiusValues = csvData.map(function(row) {
    return row.radialColumn;
  });

  //set the domain of the linear x scale to be the extent (lowest and highest) datapoints
  // xScale.domain(d3.extent(xAxisValues));
  xScale.domain([0,2508]);

  //ADJUST MAX AND MIN OF Y AXIS
  yScale.domain([0, 265.6]);

  //ADJUST SIZE OF BUBBLES
  radiusScale.domain([0.388968, 108.295023]);

  var svg = d3.select("#energy")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

    //HERE"S WHERE TO START EDITING THE TOOLTIP

  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip-style")
    .style('opacity',0);

  var yAxis = d3.axisLeft(yScale)
  .tickFormat(function(value){
    return '$'+value;
  });

  var yAxisContainer = svg.append("g");

  // EDIT THE TICK FORMAT HERE
  var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(value) {
      return value;
      // return ["$"] + value + "suffix";
    });

  var xAxisContainer = svg.append("g")
    .attr("transform", "translate(0 " + height + ")");

  //yAxis(yAxisContainer);
  yAxisContainer.call(yAxis);

  //xAxis(xAxisContainer);
  xAxisContainer.call(xAxis);

  //ADJUST scatter dot here
  csvData.forEach(function(row) {
    svg.append("circle")
    .datum(row)
      .attr("r", function(d) {
        return radiusScale(d.radialColumn);
      });

  });

  // text label for the x axis
svg.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height +margin.top+10) + ")")
  .style("text-anchor", "middle")
  .text(xAxisLabel)
  .attr('class','axisLabel');

  // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel)
        .attr('class','axisLabel');

  var circles = svg.selectAll("circle")
    .attr("cx", function(d) {
      return xScale(d.xAxisColumn);
    })
    .attr("cy", function(d) {
      return yScale(d.yAxisColumn);
    })
    .attr("fill", function(d) {
      return colorScale(d.seriesColor);
    })
    .attr('opacity', '0.5')
    .on("mouseout", function(d) {
      tooltip.text(defaultTooltip);
      d3.select(this)
      .attr("stroke", "none")
      ;
    })
  //this is still in reference to circles, not to tooltip, which lives in css
    .on('mouseout', function(d){
    div.transition()
    .duration(1000)
    .style('opacity',0)
    d3.select(this)
    .attr('stroke','none')
    .attr('fill', '#98002E')
    ;
  })
  //showw css when hover on circles
    .on('mouseover', function(d){
    d3.select(this)
    .attr('stroke', 'white')
    .attr('fill', '#582700')
    div.transition()
    .duration(200)
    .attr('stroke-width', '5')
    .style("opacity", 1)
    div.text(d.company+' CEO, '+d.name+' earned $'+ d.radialColumn+' M in 2018.')
    .style("left", (d3.event.pageX -20) + "px")
            .style("top",(d3.event.pageY-100 ) + "px");
})

  var sourceLabel = d3.select("#energy")
      .append("div")
      .attr("class", "sourceLabel")
      .text(sourceText)
})

// FINANCIALS
// LOAD THE DATA --> the data is stored in a "dictionary" the + is to turn the row names into strings? or strings to js
d3.csv("data/financials.csv", function(err, csvData) {
  csvData.forEach(function(row) {
    //EDIT for x axis values
    row.xAxisColumn = +row.xAxisColumn;
    //EDIT for y axis values
    row.yAxisColumn = +row.yAxisColumn;
    //EDIT for radius values
    row.radialColumn = +row.radialColumn;
    //edit if filtering numeric data
    // row.company = +row.company;
  });

  //pass it the variable that will become the xAxis
  var xAxisValues = csvData.map(function(row) {
    return row.xAxisColumn;
  });

  // pass it the variable that will become Y axis
  var yAxisValues = csvData.map(function(row) {
    return row.yAxisColumn;
  });

  // extract the population data
  var radiusValues = csvData.map(function(row) {
    return row.radialColumn;
  });

  //set the domain of the linear x scale to be the extent (lowest and highest) datapoints
  // xScale.domain(d3.extent(xAxisValues));
  xScale.domain([0,2508]);

  //ADJUST MAX AND MIN OF Y AXIS
  yScale.domain([0, 265.6]);

  //ADJUST SIZE OF BUBBLES
  radiusScale.domain([0.388968, 108.295023]);

  var svg = d3.select("#financials")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

    //HERE"S WHERE TO START EDITING THE TOOLTIP

  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip-style")
    .style('opacity',0);

  var yAxis = d3.axisLeft(yScale)
  .tickFormat(function(value){
    return '$'+value;
  });

  var yAxisContainer = svg.append("g");

  // EDIT THE TICK FORMAT HERE
  var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(value) {
      return value;
      // return ["$"] + value + "suffix";
    });

  var xAxisContainer = svg.append("g")
    .attr("transform", "translate(0 " + height + ")");

  //yAxis(yAxisContainer);
  yAxisContainer.call(yAxis);

  //xAxis(xAxisContainer);
  xAxisContainer.call(xAxis);

  //ADJUST scatter dot here
  csvData.forEach(function(row) {
    svg.append("circle")
    .datum(row)
      .attr("r", function(d) {
        return radiusScale(d.radialColumn);
      });

  });

  // text label for the x axis
svg.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height +margin.top+10) + ")")
  .style("text-anchor", "middle")
  .text(xAxisLabel)
  .attr('class','axisLabel');

  // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel)
        .attr('class','axisLabel');

  var circles = svg.selectAll("circle")
    .attr("cx", function(d) {
      return xScale(d.xAxisColumn);
    })
    .attr("cy", function(d) {
      return yScale(d.yAxisColumn);
    })
    .attr("fill", function(d) {
      return colorScale(d.seriesColor);
    })
    .attr('opacity', '0.5')
    .on("mouseout", function(d) {
      tooltip.text(defaultTooltip);
      d3.select(this)
      .attr("stroke", "none")
      ;
    })
  //this is still in reference to circles, not to tooltip, which lives in css
    .on('mouseout', function(d){
    div.transition()
    .duration(1000)
    .style('opacity',0)
    d3.select(this)
    .attr('stroke','none')
    .attr('fill', '#98002E')
    ;
  })
  //showw css when hover on circles
    .on('mouseover', function(d){
    d3.select(this)
    .attr('stroke', 'white')
    .attr('fill', '#582700')
    div.transition()
    .duration(200)
    .attr('stroke-width', '5')
    .style("opacity", 1)
    div.text(d.company+' CEO, '+d.name+' earned $'+ d.radialColumn+' M in 2018.')
    .style("left", (d3.event.pageX -20) + "px")
            .style("top",(d3.event.pageY-100 ) + "px");
})

  var sourceLabel = d3.select("#financials")
      .append("div")
      .attr("class", "sourceLabel")
      .text(sourceText)
})

// HEALTHCARE
d3.csv("data/healthcare.csv", function(err, csvData) {
  csvData.forEach(function(row) {
    //EDIT for x axis values
    row.xAxisColumn = +row.xAxisColumn;
    //EDIT for y axis values
    row.yAxisColumn = +row.yAxisColumn;
    //EDIT for radius values
    row.radialColumn = +row.radialColumn;
    //edit if filtering numeric data
    // row.company = +row.company;
  });

  //pass it the variable that will become the xAxis
  var xAxisValues = csvData.map(function(row) {
    return row.xAxisColumn;
  });

  // pass it the variable that will become Y axis
  var yAxisValues = csvData.map(function(row) {
    return row.yAxisColumn;
  });

  // extract the population data
  var radiusValues = csvData.map(function(row) {
    return row.radialColumn;
  });

  //set the domain of the linear x scale to be the extent (lowest and highest) datapoints
  // xScale.domain(d3.extent(xAxisValues));
  xScale.domain([0,2508]);

  //ADJUST MAX AND MIN OF Y AXIS
  yScale.domain([0, 265.6]);

  //ADJUST SIZE OF BUBBLES
  radiusScale.domain([0.388968, 108.295023]);

  var svg = d3.select("#healthcare")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

    //HERE"S WHERE TO START EDITING THE TOOLTIP

  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip-style")
    .style('opacity',0);

  var yAxis = d3.axisLeft(yScale)
  .tickFormat(function(value){
    return '$'+value;
  });

  var yAxisContainer = svg.append("g");

  // EDIT THE TICK FORMAT HERE
  var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(value) {
      return value;
      // return ["$"] + value + "suffix";
    });

  var xAxisContainer = svg.append("g")
    .attr("transform", "translate(0 " + height + ")");

  //yAxis(yAxisContainer);
  yAxisContainer.call(yAxis);

  //xAxis(xAxisContainer);
  xAxisContainer.call(xAxis);

  //ADJUST scatter dot here
  csvData.forEach(function(row) {
    svg.append("circle")
    .datum(row)
      .attr("r", function(d) {
        return radiusScale(d.radialColumn);
      });

  });

  // text label for the x axis
svg.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height +margin.top+10) + ")")
  .style("text-anchor", "middle")
  .text(xAxisLabel)
  .attr('class','axisLabel');

  // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel)
        .attr('class','axisLabel');

  var circles = svg.selectAll("circle")
    .attr("cx", function(d) {
      return xScale(d.xAxisColumn);
    })
    .attr("cy", function(d) {
      return yScale(d.yAxisColumn);
    })
    .attr("fill", function(d) {
      return colorScale(d.seriesColor);
    })
    .attr('opacity', '0.5')
    .on("mouseout", function(d) {
      tooltip.text(defaultTooltip);
      d3.select(this)
      .attr("stroke", "none")
      ;
    })
  //this is still in reference to circles, not to tooltip, which lives in css
    .on('mouseout', function(d){
    div.transition()
    .duration(1000)
    .style('opacity',0)
    d3.select(this)
    .attr('stroke','none')
    .attr('fill', '#98002E')
    ;
  })
  //showw css when hover on circles
    .on('mouseover', function(d){
    d3.select(this)
    .attr('stroke', 'white')
    .attr('fill', '#582700')
    div.transition()
    .duration(200)
    .attr('stroke-width', '5')
    .style("opacity", 1)
    div.text(d.company+' CEO, '+d.name+' earned $'+ d.radialColumn+' M in 2018.')
    .style("left", (d3.event.pageX -20) + "px")
            .style("top",(d3.event.pageY-100 ) + "px");
})

  var sourceLabel = d3.select("#healthcare")
      .append("div")
      .attr("class", "sourceLabel")
      .text(sourceText)
})

// INDUSTRIALS
d3.csv("data/industrials.csv", function(err, csvData) {
  csvData.forEach(function(row) {
    //EDIT for x axis values
    row.xAxisColumn = +row.xAxisColumn;
    //EDIT for y axis values
    row.yAxisColumn = +row.yAxisColumn;
    //EDIT for radius values
    row.radialColumn = +row.radialColumn;
    //edit if filtering numeric data
    // row.company = +row.company;
  });

  //pass it the variable that will become the xAxis
  var xAxisValues = csvData.map(function(row) {
    return row.xAxisColumn;
  });

  // pass it the variable that will become Y axis
  var yAxisValues = csvData.map(function(row) {
    return row.yAxisColumn;
  });

  // extract the population data
  var radiusValues = csvData.map(function(row) {
    return row.radialColumn;
  });

  //set the domain of the linear x scale to be the extent (lowest and highest) datapoints
  // xScale.domain(d3.extent(xAxisValues));
  xScale.domain([0,2508]);

  //ADJUST MAX AND MIN OF Y AXIS
  yScale.domain([0, 265.6]);

  //ADJUST SIZE OF BUBBLES
  radiusScale.domain([0.388968, 108.295023]);

  var svg = d3.select("#industrials")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

    //HERE"S WHERE TO START EDITING THE TOOLTIP

  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip-style")
    .style('opacity',0);

  var yAxis = d3.axisLeft(yScale)
  .tickFormat(function(value){
    return '$'+value;
  });

  var yAxisContainer = svg.append("g");

  // EDIT THE TICK FORMAT HERE
  var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(value) {
      return value;
      // return ["$"] + value + "suffix";
    });

  var xAxisContainer = svg.append("g")
    .attr("transform", "translate(0 " + height + ")");

  //yAxis(yAxisContainer);
  yAxisContainer.call(yAxis);

  //xAxis(xAxisContainer);
  xAxisContainer.call(xAxis);

  //ADJUST scatter dot here
  csvData.forEach(function(row) {
    svg.append("circle")
    .datum(row)
      .attr("r", function(d) {
        return radiusScale(d.radialColumn);
      });

  });

  // text label for the x axis
svg.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height +margin.top+10) + ")")
  .style("text-anchor", "middle")
  .text(xAxisLabel)
  .attr('class','axisLabel');

  // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel)
        .attr('class','axisLabel');

  var circles = svg.selectAll("circle")
    .attr("cx", function(d) {
      return xScale(d.xAxisColumn);
    })
    .attr("cy", function(d) {
      return yScale(d.yAxisColumn);
    })
    .attr("fill", function(d) {
      return colorScale(d.seriesColor);
    })
    .attr('opacity', '0.5')
    .on("mouseout", function(d) {
      tooltip.text(defaultTooltip);
      d3.select(this)
      .attr("stroke", "none")
      ;
    })
  //this is still in reference to circles, not to tooltip, which lives in css
    .on('mouseout', function(d){
    div.transition()
    .duration(1000)
    .style('opacity',0)
    d3.select(this)
    .attr('stroke','none')
    .attr('fill', '#98002E')
    ;
  })
  //showw css when hover on circles
    .on('mouseover', function(d){
    d3.select(this)
    .attr('stroke', 'white')
    .attr('fill', '#582700')
    div.transition()
    .duration(200)
    .attr('stroke-width', '5')
    .style("opacity", 1)
    div.text(d.company+' CEO, '+d.name+' earned $'+ d.radialColumn+' M in 2018.')
    .style("left", (d3.event.pageX -20) + "px")
            .style("top",(d3.event.pageY-100 ) + "px");
})

  var sourceLabel = d3.select("#industrials")
      .append("div")
      .attr("class", "sourceLabel")
      .text(sourceText)
})

// OTHER
d3.csv("data/other.csv", function(err, csvData) {
  csvData.forEach(function(row) {
    //EDIT for x axis values
    row.xAxisColumn = +row.xAxisColumn;
    //EDIT for y axis values
    row.yAxisColumn = +row.yAxisColumn;
    //EDIT for radius values
    row.radialColumn = +row.radialColumn;
    //edit if filtering numeric data
    // row.company = +row.company;
  });

  //pass it the variable that will become the xAxis
  var xAxisValues = csvData.map(function(row) {
    return row.xAxisColumn;
  });

  // pass it the variable that will become Y axis
  var yAxisValues = csvData.map(function(row) {
    return row.yAxisColumn;
  });

  // extract the population data
  var radiusValues = csvData.map(function(row) {
    return row.radialColumn;
  });

  //set the domain of the linear x scale to be the extent (lowest and highest) datapoints
  // xScale.domain(d3.extent(xAxisValues));
  xScale.domain([0,2508]);

  //ADJUST MAX AND MIN OF Y AXIS
  yScale.domain([0, 265.6]);

  //ADJUST SIZE OF BUBBLES
  radiusScale.domain([0.388968, 108.295023]);

  var svg = d3.select("#other")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

    //HERE"S WHERE TO START EDITING THE TOOLTIP

  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip-style")
    .style('opacity',0);

  var yAxis = d3.axisLeft(yScale)
  .tickFormat(function(value){
    return '$'+value;
  });

  var yAxisContainer = svg.append("g");

  // EDIT THE TICK FORMAT HERE
  var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(value) {
      return value;
      // return ["$"] + value + "suffix";
    });

  var xAxisContainer = svg.append("g")
    .attr("transform", "translate(0 " + height + ")");

  //yAxis(yAxisContainer);
  yAxisContainer.call(yAxis);

  //xAxis(xAxisContainer);
  xAxisContainer.call(xAxis);

  //ADJUST scatter dot here
  csvData.forEach(function(row) {
    svg.append("circle")
    .datum(row)
      .attr("r", function(d) {
        return radiusScale(d.radialColumn);
      });

  });

  // text label for the x axis
svg.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height +margin.top+10) + ")")
  .style("text-anchor", "middle")
  .text(xAxisLabel)
  .attr('class','axisLabel');

  // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel)
        .attr('class','axisLabel');

  var circles = svg.selectAll("circle")
    .attr("cx", function(d) {
      return xScale(d.xAxisColumn);
    })
    .attr("cy", function(d) {
      return yScale(d.yAxisColumn);
    })
    .attr("fill", function(d) {
      return colorScale(d.seriesColor);
    })
    .attr('opacity', '0.5')
    .on("mouseout", function(d) {
      tooltip.text(defaultTooltip);
      d3.select(this)
      .attr("stroke", "none")
      ;
    })
  //this is still in reference to circles, not to tooltip, which lives in css
    .on('mouseout', function(d){
    div.transition()
    .duration(1000)
    .style('opacity',0)
    d3.select(this)
    .attr('stroke','none')
    .attr('fill', '#98002E')
    ;
  })
  //showw css when hover on circles
    .on('mouseover', function(d){
    d3.select(this)
    .attr('stroke', 'white')
    .attr('fill', '#582700')
    div.transition()
    .duration(200)
    .attr('stroke-width', '5')
    .style("opacity", 1)
    div.text(d.company+' CEO, '+d.name+' earned $'+ d.radialColumn+' M in 2018.')
    .style("left", (d3.event.pageX -20) + "px")
            .style("top",(d3.event.pageY-100 ) + "px");
})

  var sourceLabel = d3.select("#other")
      .append("div")
      .attr("class", "sourceLabel")
      .text(sourceText)
})


;
