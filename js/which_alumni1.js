var margin = {top: 20, right: 30, bottom: 30, left: 200}

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var filtered_data;
var percent = d3.format("%")


var x = d3.scale.linear()
  .domain([0, 0.75])
  .range([0, width]);

var y = d3.scale.ordinal()
  .rangeRoundBands([0, height], .1);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10, "%")

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../data/ent_vs_nent.csv", type, function(error, data) {

  filtered_data = data.filter(function(d) {
      return d.kind == 'demog';
    })

  y.domain(filtered_data.map(function(d){return d.name}))

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis);

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  var bar = chart.selectAll(".bar")
      .data(filtered_data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("y", function(d){return y(d.name);})
      .attr("width", function(d){return x(d.freq_ent);})
      .attr("height", y.rangeBand());

})

function type(d) {
  d.freq_ent = +d.freq_ent;
  d.freq_nent = +d.freq_nent;
  return d;
}
