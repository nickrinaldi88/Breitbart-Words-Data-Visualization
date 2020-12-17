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
  // group the data with the word as the key

  var output = {};

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    // Has the word been come across already? Create an empty array in `output` at property `output[word]`
    if (!output[item.Word]) output[item.Word] = [];

    // For all rows, add the item to the appropriate array.
    output[item.Word].push({ date: item.Date, count: item.Count });
  }

  // console.log(output["Obama"][0].count);

  // store all the counts in an array
  // find max of that
  // store in k, v pair of word: "Word", max_count: "Count"

  console.log(output);

  function doStuff() {
    // create array of keys
    var the_words = Object.keys(output);
    var obama_counts = [];
    var data_count = {};
    for (var n = 0; n < the_words.length; n++) {
      var new_word = the_words[n]; // word we use to index 'output'
      // produce
      for (var i = 0; i < output[new_word].length; i++) {
        obama_counts.push(output[new_word][i].count);
      }
      var the_max = Math.max.apply(Math, obama_counts);
      data_count;
    }
    console.log(obama_counts);

    var the_max = Math.max.apply(Math, obama_counts);
    // // console.log(typeof obama_counts);
    // console.log(the_max);
  }

  // for each word in (array of words)

  doStuff();

  const words = d3
    .nest()
    .key(function (d) {
      return d.Word;
    })
    .entries(data);
  //
  // console.log(words);

  // var the_words = [
  //   "Obama",
  //   "Trump",
  //   "ISIS",
  //   "Hoax",
  //   "Media",
  //   "Guns",
  //   "Russia",
  //   "Putin",
  //   "Extremmist",
  //   "God",
  // ];

  for (var ix = 0; ix < the_words.length; ix++) {
    var the_name = [];
    the_name.varname = the_words[n];
    for (var i = 0; i < words[0].values.length; i++) {
      let our_obj = {};
      our_obj["date"] = words[ix].values[i].Date;
      our_obj["count"] = words[ix].values[i].Count;
      our_obj.varname = the_words[ix];
      the_name.push(our_obj);
    }
  }

  // console.log(the_name);
  // console.log(words[0].values[0].Date);

  // console.log(words[0].values[136].Count);

  const legend_keys = [];

  // create legend key array
  function create_arr() {
    for (i = 0; i < words.length; i++) {
      legend_keys.push(words[i].key);
    }
  }

  // console.log(words[0].values.Date);

  create_arr();
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

  // legend
  //   .selectAll("rect")
  //   .data(words)
  //   .enter()
  //   .append("rect")
  //   .attr("x", width + 65)
  //   .attr("y", function (d, i) {
  //     return i * 50;
  //   })
  //   .attr("width", 10)
  //   .attr("height", 10)
  //   .style("fill", function (d) {
  //     return color(d.key);
  //   });

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

  // for (var i = 0; i < the_words.length; i++) {
  //   var name = the_words[i];

  // }

  // format var obama = [
  //   {date: dec 11, count: x}
  // ]

  // draws lines

  // const the_path = svg
  //   .selectAll(".line")
  //   .data(words)
  //   .enter()
  //   .append("path")
  //   .attr("class", "line")
  //   .attr("fill", "none")
  //   .attr("stroke", function (d) {
  //     return color(d.key);
  //   })
  //   .attr("stroke-width", 1.5)
  //   .attr("d", function (d) {
  //     return d3
  //       .line()
  //       .x(function (d) {
  //         return x(d.Date);
  //       })
  //       .y(function (d) {
  //         return y(d.Count);
  //       })(d.values);
  //   });
  // update function

  var series = [];

  for (var n = 0; n < words.length; n++) {
    var count = [];
    // create key once, create count 136 times, next key
    for (var m = 0; m < 136; m++) {
      // use words here?

      count.push(words[n].values[m].Count);
    }
    series.push({ word: words[n].key, count });
  }

  var our_dates = [];

  for (var ix = 0; ix < 136; ix++) {
    our_dates.push(data[ix].Date);
  }

  function update(data) {
    // x axis

    var xAxis = d3
      .scaleTime() // creaters linear scale for time
      .domain(
        d3.extent(
          data,
          // d3.extent returns [min, max]
          (d) => d
        )
      )
      .range([margin.left - -30, width - margin.right]);

    svg
      .selectAll(".x-axis")
      .transition()
      .duration(3000)
      .call(d3.axisBottom(xAxis));

    var yAxis = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Count)])
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll(".y-axis")
      .transition()
      .duration(3000)
      .call(d3.axisLeft(yAxis));

    var u = svg.selectAll(".linetest").data([other], function (d) {
      return other.count;
    });

    const the_path = svg
      .selectAll(".line")
      .data(words)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d.key);
      })
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return x(d.Date);
          })
          .y(function (d) {
            return y(d.Count);
          })(d.values);
      });

    // u.enter()
    //   .append("path")
    //   .attr("class", "lineTest")
    //   .merge(u)
    //   .transition()
    //   .duration(3000)
    //   .attr(
    //     "d", function
    //     d3
    //       .line()
    //       .x(function (d) {
    //         return x(our_dates);
    //       })
    //       .y(function (d) {
    //         return y(data.Count);
    //       })
    //   )
    //   .attr("fill", "none")
    //   .attr("stroke", "steelblue")
    //   .attr("stroke-width", 2.5);
  }

  // console.log(series[8].count);
  update(data, our_dates, series[8]);
  // console.log(series[10].count);

  // trump would be series[0]
  // obama would be series[1] - this is what we pass into the function
});

// console.log(words);

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
