var margin = {
  top: 20,
  right: 30,
  bottom: 30,
  left: 500
}
w = 960; //width of svg
var width = w - margin.left - margin.right; // width of the chart


var filtered_data;
var percent = d3.format(".0%")


var x = d3.scale.linear()
  .range([0, width])

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(5, "%")
  .tickFormat(percent);

var y = d3.scale.ordinal()

d3.csv("../data/ent_vs_nent.csv", type, function(error, data) {

  filtered_data = data.filter(function(d) {
    return d.kind == 'experience';
  })

  filtered_data.sort(function(a, b){return a.freq_ent - b.freq_ent;})

  var height = filtered_data.length * 60 - margin.top - margin.bottom;

  var chart = d3.select("#exp")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  x.domain([0, d3.max(filtered_data.map(function(d) {
    return d3.max([d.freq_ent, d.freq_nent]);
  }))]);

  y.rangeRoundBands([0, height], .35);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  y.domain(filtered_data.map(function(d) {
    return d.name;
  }))

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis);

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  function render_bars(elements_to_select, class_to_apply, data_to_select) {

    var bar = chart.selectAll(elements_to_select)
      .data(filtered_data)
      .enter().append("g")

    bar.append("rect")
      .attr("class", class_to_apply)
      .attr("y", function(d) {
        if (data_to_select === "freq_ent")
          return y(d.name);
        else
          return y(d.name) + y.rangeBand() / 2;
      })
      .attr("width", function(d) {
        return x(d[data_to_select]);
      })
      .attr("height", y.rangeBand() / 2)
      .on("mouseenter", function() {
        d3.selectAll(".text_on_bar")
          .style("display", "block")
      })
      .on("mouseleave", function() {
        d3.selectAll(".text_on_bar")
          .style("display", "none")
      })

    bar.append("text")
      .attr("class", "text_on_bar")
      .attr("x", function(d) {
        return x(d[data_to_select]) - 25;
      })
      .attr("y", function(d) {
        if (data_to_select == "freq_ent")
          return y(d.name);
        else
          return y(d.name) + y.rangeBand() / 2;
      })
      .attr("dy", "1.1em")
      .text(function(d) {
        return percent(d[data_to_select]);
      })
      .style("display", "none")

  }
  render_bars("g .ent", "ent", "freq_ent")
  render_bars("g .nent", "nent", "freq_nent")
})

function type(d) {
  d.freq_ent = +d.freq_ent;
  d.freq_nent = +d.freq_nent;
  return d;
}
