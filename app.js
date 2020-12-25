const margin = { top: 20, right: 30, bottom: 30, left: 0 },
  width = 1000 - margin.left - margin.right;
height = 600 - margin.top - margin.bottom;

// maybe a translate line

// document.body.append(svg);
const div_block = document.getElementById("main-div");
// console.log(div_block);

const svg = d3
  .select("svg")
  .attr("width", width + margin.left + margin.right) // viewport size
  .attr("height", height + margin.top + margin.bottom) // viewport size
  .append("g")
  .attr("transform", "translate(40, 20)")
  .attr("class", "visible-graph"); // center g in svg

// load csv

d3.csv("breitbartData.csv").then((data) => {
  // convert Count column values to numbers

  data.forEach((d) => {
    d.Count = +d.Count;
    d.Date = new Date(d.Date);
  });

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

  const words = d3
    .nest()
    .key(function (d) {
      return d.Word;
    })
    .entries(data);

  const legend_keys = [];

  // create legend key array
  function create_arr() {
    for (i = 0; i < words.length; i++) {
      legend_keys.push(words[i].key);
    }
  }

  create_arr();

  d3.select("select")
    .selectAll("option")
    .data(Object.keys(current_data))
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    });
  // create x scale

  var x = d3
    .scaleTime() // creaters linear scale for time
    .domain(
      d3.extent(
        data,

        // d3.extent returns [min, max]
        (d) => d.Date
      )
    )
    .range([margin.left - -30, width - margin.right]);

  // x axis

  svg
    .append("g")
    .attr("class", "x-axis")
    .style("transform", `translate(-3px, 522px)`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("class", "axis-label-x")
    .attr("x", "55%")
    .attr("dy", "4em")
    // .attr("dy", "20%")
    .style("fill", "black")
    .text("Months");

  // create y scale

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Count)])
    .range([height - margin.bottom, margin.top]);

  // y axis

  svg
    .append("g")
    .attr("class", "y-axis")
    .style("transform", `translate(27px, 0px)`)
    .call(d3.axisLeft(y));

  // line colors

  const line_colors = words.map(function (d) {
    return d.key; // list of words
  });

  const color = d3
    .scaleOrdinal()
    .domain(line_colors)
    .range([
      "#e41a1c",
      "#377eb8",
      "#4daf4a",
      "#984ea3",
      "#ff7f00",
      "#ffff33",
      "#a65628",
      "#f781bf",
      "#999999",
      "#872ff8",
    ]); //https://observablehq.com/@d3/d3-scaleordinal

  // craete legend variable

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 100)
    .attr("transform", "translate(-20, 50)");

  // create legend shapes and locations

  const legendGroups = legend
    .selectAll("g.legend-item")
    .data(words)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .style("transform", function (d, i) {
      return `translate(${width + 65}px, ${i * 20}px)`;
    });

  legendGroups
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function (d) {
      return color(d.key);
    });

  legendGroups
    .append("text")
    .attr("x", 20)
    .attr("y", 9)
    .text(function (d, i) {
      // d must be passed in because its the data
      return words[i].key;
    });

  var output = {};

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    // Has the word been come across already? Create an empty array in `output` at property `output[word]`
    if (!output[item.Word]) output[item.Word] = [];

    // For all rows, add the item to the appropriate array.
    output[item.Word].push({ date: item.Date, count: item.Count });
  }
  // console.log(output.date);
  // pass in data_count.(word)
  function doStuff() {
    // create array of keys
    var the_words = Object.keys(output);
    var data_count = {};
    for (var n = 0; n < the_words.length; n++) {
      var our_list = [];
      var new_word = the_words[n]; // word we use to index 'output'
      // produce
      for (var i = 0; i < output[new_word].length; i++) {
        our_list.push({
          date: output[new_word][i].date,
          count: output[new_word][i].count,
        });
        // console.log(obama_counts); // adds count of words to array
      }
      // var the_max = Math.max.apply(Math, obama_counts);
      data_count[new_word] = our_list;
      // console.log(the_max);
      // data_count;
      // console.log(data_count);
    }

    return data_count;

    // button onclick(update(data_count.Obama.count))

    // var the_max = Math.max.apply(Math, obama_counts);
    // // console.log(typeof obama_counts);
    // console.log(the_max);
  }

  var dc_count = doStuff();

  function update(data_count) {
    // function to grab count and date data from the data_set

    function getFields(input, field) {
      var result = [];
      for (var i = 0; i < input.length; ++i) result.push(input[i][field]);
      return result;
    }

    var the_count = getFields(data_count, "count");
    var the_date = getFields(data_count, "date");

    // console.log(the_count);
    // console.log(the_date);

    // x axis

    var xAxis = d3
      .scaleTime() // creaters linear scale for time
      .domain(
        d3.extent(
          the_date
          // d3.extent returns [min, max]
        )
      )
      .range([margin.left - -30, width - margin.right]);

    svg.selectAll(".x-axis").call(d3.axisBottom(xAxis));

    var yAxis = d3
      .scaleLinear()
      .domain([0, the_count])
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll(".y-axis")
      .transition()
      .duration(3000)
      .call(d3.axisLeft(yAxis));

    svg
      .selectAll(".line")
      .data(data_count)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d, i) {
            return xAxis(d[i].date);
          })
          .y(function (d, i) {
            return yAxis(d[i].count);
          })
      );
  }

  // create function that parses inserted data set
  // stores the counts in an array
  // stores the dates in an array
  // the indexes of arrays should lineup
  // .x and .y should line up based on count and date correlation

  // u.enter()
  //   .append("path")
  //   .attr("class", "lineTest")
  //   .merge(u)
  //   .transition()
  //   .duration(3000)
  //   .attr(
  //     "d",
  //     d3
  //       .line()
  //       .x(function (d) {
  //         return xAxis(d.the_date);
  //       })
  //       .y(function (d) {
  //         return yAxis(d.the_count);
  //       })
  //   )
  //   .attr("fill", "none")
  //   .attr("stroke", "steelblue")
  //   .attr("stroke-width", 2.5);

  // create data variable, add date and count variables accordingly
  // in .x and .y funcs on line 388, d => x(d.date), d => y(d.count)
  update(dc_count.Extremist);
});

// console.log(series[8].count);

//
// https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array

// https://www.d3-graph-gallery.com/graph/line_change_data.html

// format var obama = [
//   {date: dec 11, count: x}
// ]

// Seperate each word into it's own dataset
// store data set in each variable
// https://stackoverflow.com/questions/52682018/javascript-d3-create-datasets-from-one-set-of-data
// each word should hold precedence
// shrink y axis on update to the max of the count of our words
// each button will simply run the update function on the column we want.
