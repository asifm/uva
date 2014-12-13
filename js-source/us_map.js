function draw_usmap() {
  var width = 1050;
  var height = 500;
  var centered;

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "map-tooltip")
    .style("position", "absolute")

  var radius = d3.scale.sqrt()
    .domain([1, 600])
    .range([2, 20])

  var projection = d3.geo.albersUsa()
    .translate([width / 2, height / 2])
    .scale(1000);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#us-map").append("svg")
    .attr("width", width)
    .attr("height", height)

  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map-container")
    .on("click", clicked)

  var g = svg.append("g")

  d3.json("data/us-states.json", function(error, us_states) {

    g.selectAll("path")
      .data(us_states.features)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
      .on("click", clicked);

    d3.csv("data/ventures_by_city_us.csv", type, function(error, city_data) {

      city_data.sort(function(a, b) {
        return b.value - a.value;
      });

      g.selectAll("circle")
        .data(city_data)
        .enter()
        .append("circle")
        .attr("class", "map-circle")
        .attr("cx", function(d) {
          return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
          return radius(d.value);
        })
        .on("mouseover", function(d) {
          desc = d.desc
          value = d.value
          tooltip.html(desc + " <b>" + value + "</b>")
            .style("left", (d3.event.pageX - 15) + "px")
            .style("top", (d3.event.pageY + 50) + "px")
            .style("opacity", 1)
          d3.select(this).style("fill", "white")
        })
      .on("mouseleave", function(d) {
          tooltip
            .style("opacity", 0);
          d3.select(this).style("fill", "orange")
        })
        .on("click", clicked)
    })
  })


  function clicked(d) {
    var x, y, k;
    if (d && centered !== d) {
      if (d.type == "Feature") {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
      } else {
        x = projection([d.lon, d.lat])[0]
        y = projection([d.lon, d.lat])[1]
      }
      k = 4;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    g.selectAll("path")
      .classed("active", centered && function(d) {
        return d === centered;
      });

    g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

  }
function zoom_out() {
  var x, y, k;
  x = width / 2;
  y = height / 2;
  k = 1;
  centered = null;

  g.selectAll("path")
    .classed("active", centered && function(d) {
      return d === centered;
    });

  g.transition()
    .duration(750)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px");
};
d3.select("#zoom-text-us").html("Click on map to zoom in. Hover for details. &nbsp;&nbsp;");
d3.select("#zoom-out-us").on("click", zoom_out);

}

function type(d) {
  d.value = +d.value;
  d.lon = +d.lon;
  d.lat = +d.lat;
  return d;
}

draw_usmap();


