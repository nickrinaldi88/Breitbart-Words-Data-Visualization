// load_csv

d3.csv(
  "https://raw.githubusercontent.com/nickrinaldi88/Breitbart-Words-Data-Visualization/master/breitbartData.csv"
).then(function (csv) {
  // reformat data
  //   console.log(csv);
  var current_data = {};
  var parse = d3.timeParse("%Y-%m-%d");

  for (var i = 0; i < csv.length; i++) {
    var item = csv[i];
    if (!current_data[item.Word]) current_data[item.Word] = [];

    current_data[item.Word].push({
      date: parse(item.Date),
      count: item.Count,
    });
  }

  //   add words to the option
  d3.select("select")
    .selectAll("option")
    .data(Object.keys(current_data))
    .enter()
    .append("option")
    // .text("Select a word")
    .text(function (d) {
      return d;
    });

  d3.select("select").on("change", function () {
    update(current_data[this.value]);
  });

  // set the dimensions and margins of the graph
  var margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 0,
    },
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#main-div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", "0 0 1400 800")
    .append("g")
    .attr("transform", "translate(80, 20)")
    .classed("svg-content-responsive", true);
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Initialise a X axis:
  var x = d3.scaleTime().range([0, width]);

  var xAxis = d3.axisBottom().scale(x);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis")
    .append("text")
    .attr("class", "axis-label-x")
    .attr("x", "50%")
    .attr("dy", "4em")
    .style("fill", "black")
    .text("Months");
  // .text("Months");

  // Initialize an Y axis
  var y = d3.scaleLinear().range([height, 0]);

  var yAxis = d3.axisLeft().scale(y);
  svg
    .append("g")
    .attr("class", "myYaxis")
    .append("text")
    .attr("class", "axis-label-y")
    .attr("x", "-10%")
    .attr("transform", "rotate(-90)")
    .attr("dy", "-7%")
    .style("fill", "black")
    .text("Word Count");

  // Create a function that takes a dataset as input and update the plot:

  function update(data) {
    // Create the X axis:
    x.domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );
    svg.selectAll(".myXaxis").transition().duration(3000).call(xAxis);

    // create the Y axis
    y.domain([
      0,
      d3.max(data, function (d) {
        return +d.count;
      }),
    ]);
    svg.selectAll(".myYaxis").transition().duration(3000).call(yAxis);

    // Create a update selection: bind to the new data
    var u = svg.selectAll(".lineTest").data([data]);

    // Update the line
    u.enter()
      .append("path")
      .attr("class", "lineTest")
      .merge(u)
      .transition()
      .duration(3000)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.count);
          })
      )
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5);
  }

  // At the beginning, I run the update function on the first dataset:
  update(current_data.Obama);
});

// bottom graph

d3.csv("bb_totals.csv").then(function (csv) {
  var margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 0,
    },
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  d3.select("#slct2")
    .selectAll("option")
    .data(["Trump", "No Trump"])
    .enter()
    .append("option")
    // .text("Select a word")
    .text(function (d) {
      return d;
    });

  var svg2 = d3
    .select("#sec-div")
    .classed("svg-container", true)
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", "0 0 1400 800")
    .append("g")
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    .attr("transform", "translate(100, 20)")
    .classed("svg-content-responsive", true);

  var x = d3.scaleLinear().domain([0, 40000]).range([0, width]);

  // console.log(d3.max(csv, (d) => d.Count));

  svg2
    .selectAll(".myXaxis2")
    .transition()
    .duration(3000)
    .call(d3.axisBottom(x));

  svg2
    .append("text")
    .attr("class", "axis-label-x")
    .attr("x", "40%")
    .attr("dy", "55%")
    .style("fill", "black")
    .text("Total Word Count");

  var y = d3
    .scaleBand()
    .range([0, height])
    .domain(
      csv.map(function (d) {
        return d.Word;
      })
    )
    .padding(5);

  svg2.selectAll(".myYaxis2").transition().duration(3000).call(d3.axisLeft(y));

  // lines

  var u2 = svg2.selectAll(".myline").data(csv);

  u2.enter()
    .append("line")
    .attr("class", "myline")
    .merge(u2)
    .transition()
    .duration(3000)
    .attr("x1", function (d) {
      return x(d.Count);
    })
    .attr("x2", x(0))
    .attr("y1", function (d) {
      return y(d.Word);
    })
    .attr("y2", function (d) {
      return y(d.Word);
    })
    .attr("fill", "none")
    .attr("stroke", "grey");

  var u2_circ = svg2.selectAll(".mycircle").data(csv);

  u2_circ
    .enter()
    .append("circle")
    .attr("class", "mycircle")
    .merge(u2)
    // .data(csv)
    // .enter()
    .transition()
    .duration(3000)
    .attr("cx", function (d) {
      return x(d.Count);
    })
    .attr("cy", function (d) {
      return y(d.Word);
    })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "black");

  // accept noTrump which contains non Trump data, or Trump which contains Trump data

  // console.log(d3.max(csv, (d) => d.Count));

  // x axis

  var x = d3.scaleLinear().domain([0, 40000]).range([0, width]);

  svg2
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis2")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10, 0)rotate(-45)")
    .style("text-anchor", "end");

  svg2
    .append("text")
    .attr("class", "axis-label-x")
    .attr("x", "40%")
    .attr("dy", "55%")
    .style("fill", "black")
    .text("Total Word Count");

  // y axis

  var y = d3
    .scaleBand()
    .range([0, height])
    .domain(
      csv.map(function (d) {
        return d.Word;
      })
    )
    .padding(5);

  svg2
    .append("g")
    .attr("class", "myYaxis2")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("class", "axis-label-y")
    .attr("x", "-10%")
    .attr("transform", "rotate(-90)")
    .attr("dy", "-8%")
    .style("fill", "black")
    .text("Words");
});

d3.select("#slct2").on("change", function () {
  var the_option = document.getElementById("slct2").value;
  console.log(the_option);
  if (the_option === "No Trump") {
    noTrump();
  } else if (the_option === "Trump") {
    d3.csv("bb_totals.csv").then(function (csv) {
      var margin = {
          top: 20,
          right: 30,
          bottom: 30,
          left: 0,
        },
        width = 1200 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
      var x = d3.scaleLinear().domain([0, 40000]).range([0, width]);

      // console.log(d3.max(csv, (d) => d.Count));

      var svg2 = d3.select("#sec-div").classed("svg-container", true);

      svg2
        .selectAll(".myXaxis2")
        .transition()
        .duration(3000)
        .call(d3.axisBottom(x));

      svg2
        .append("text")
        .attr("class", "axis-label-x")
        .attr("x", "40%")
        .attr("dy", "55%")
        .style("fill", "black")
        .text("Total Word Count");

      var y = d3
        .scaleBand()
        .range([0, height])
        .domain(
          csv.map(function (d) {
            return d.Word;
          })
        )
        .padding(5);

      svg2
        .selectAll(".myYaxis2")
        .transition()
        .duration(3000)
        .call(d3.axisLeft(y));

      // lines

      var u2 = svg2.selectAll(".myline").data(csv);

      u2.enter()
        .append("line")
        .attr("class", "myline")
        .merge(u2)
        .transition()
        .duration(3000)
        .attr("x1", function (d) {
          return x(d.Count);
        })
        .attr("x2", x(0))
        .attr("y1", function (d) {
          return y(d.Word);
        })
        .attr("y2", function (d) {
          return y(d.Word);
        })
        .attr("fill", "none")
        .attr("stroke", "grey");

      var u2_circ = svg2.selectAll(".mycircle").data(csv);

      u2_circ
        .enter()
        .append("circle")
        .attr("class", "mycircle")
        .merge(u2)
        // .data(csv)
        // .enter()
        .transition()
        .duration(3000)
        .attr("cx", function (d) {
          return x(d.Count);
        })
        .attr("cy", function (d) {
          return y(d.Word);
        })
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black");

      // accept noTrump which contains non Trump data, or Trump which contains Trump data

      // console.log(d3.max(csv, (d) => d.Count));

      // x axis

      var x = d3.scaleLinear().domain([0, 40000]).range([0, width]);

      svg2
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "myXaxis2")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10, 0)rotate(-45)")
        .style("text-anchor", "end");

      svg2
        .append("text")
        .attr("class", "axis-label-x")
        .attr("x", "40%")
        .attr("dy", "55%")
        .style("fill", "black")
        .text("Total Word Count");

      // y axis

      var y = d3
        .scaleBand()
        .range([0, height])
        .domain(
          csv.map(function (d) {
            return d.Word;
          })
        )
        .padding(5);

      svg2
        .append("g")
        .attr("class", "myYaxis2")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("class", "axis-label-y")
        .attr("x", "-10%")
        .attr("transform", "rotate(-90)")
        .attr("dy", "-8%")
        .style("fill", "black")
        .text("Words");
    });
  }

  function noTrump() {
    d3.csv("notrump.csv").then(function (data) {
      var margin = {
          top: 20,
          right: 30,
          bottom: 30,
          left: 0,
        },
        width = 1200 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // var svg2 = d3.select("#sec-div").classed("svg-container", true);
      //   .append("svg")
      //   // .attr("width", width + margin.left + margin.right)
      //   // .attr("height", height + margin.top + margin.bottom)
      //   .attr("viewBox", "0 0 1400 800")
      //   .append("g")
      //   // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      //   .attr("transform", "translate(100, 20)")
      //   .classed("svg-content-responsive", true);

      var x = d3.scaleLinear().domain([0, 14000]).range([0, width]);

      // console.log(d3.max(csv, (d) => d.Count));

      svg2
        .selectAll(".myXaxis2")
        .transition()
        .duration(3000)
        .call(d3.axisBottom(x));

      svg2
        .append("text")
        .attr("class", "axis-label-x")
        .attr("x", "40%")
        .attr("dy", "55%")
        .style("fill", "black");
      // .text("Total Word Count");

      var y = d3
        .scaleBand()
        .range([0, height])
        .domain(
          data.map(function (d) {
            return d.Word;
          })
        )
        .padding(5);

      svg2
        .selectAll(".myYaxis2")
        .transition()
        .duration(3000)
        .call(d3.axisLeft(y));

      // lines

      var trump_lines = svg2.selectAll(".myline");

      trump_lines.attr("display", "none");
      trump_line.attr("opacity", "0");

      var trump_circles = svg2.selectAll(".mycircle");
      trump_circles.attr("display", "none");
      trump_circles.attr("opacity", "0");

      var u2 = svg2.selectAll(".newline").data(data);

      u2.enter()
        .append("line")
        .attr("class", "newline")
        .merge(u2)
        .transition()
        .duration(3000)
        .attr("x1", function (d) {
          return x(d.Count);
        })
        .attr("x2", x(0))
        .attr("y1", function (d) {
          return y(d.Word);
        })
        .attr("y2", function (d) {
          return y(d.Word);
        })
        .attr("fill", "none")
        .attr("stroke", "grey");

      var u2_circ = svg2.selectAll(".newcircle").data(data);

      u2_circ
        .enter()
        .append("circle")
        .attr("class", "newcircle")
        .merge(u2)
        // .data(csv)
        // .enter()
        .transition()
        .duration(3000)
        .attr("cx", function (d) {
          return x(d.Count);
        })
        .attr("cy", function (d) {
          return y(d.Word);
        })
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black");

      // create select option, with trump and without trump
      // create function that changes x and y values with and without trumps addition

      // d3.select("select")
      //   .selectAll("option")
      //   .data(Object.keys(current_data))
      //   .enter()
      //   .append("option")
      //   .text(function (d) {
      //     return d;
      //   });
    });
  }
});

