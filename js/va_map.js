function draw_usmap() {
  var width = 1000;
  var height = 500;
  var centered;

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "map-tooltip")
    .style("position", "absolute")

  var radius = d3.scale.sqrt()
    .domain([1, 600])
    .range([2, 40])

  var projection = d3.geo.mercator()
    .translate([width / 2, height / 2])
    .scale(6500)
    .center([-79.4, 37.9680]);


  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#va-map").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("rx", "25")
    .attr("ry", "25")
    .attr("class", "map-container")
    .on("click", clicked);

  svg.append("text")
    .attr("x", 0)
    .attr("dx", "1em")
    .attr("y", height)
    .attr("dy", "-1em")
    .text("Click on a circle to zoom in. Click elsewhere to zoom out.")
    .style("fill", "#ccc")
    .style("font-size", "14px")

  var g = svg.append("g")

  d3.json("data/va.geo.json", function(error, virginia) {

    g.selectAll("path")
      .data(virginia.features)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
      .on("click", clicked);

    d3.csv("data/ventures_by_city_va.csv", type, function(error, city_data) {

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
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
      } else {
        x = projection([d.lon, d.lat])[0]
        y = projection([d.lon, d.lat])[1]
        k = 4;
        centered = d;
      }
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
}

function type(d) {
  d.value = +d.value;
  d.lon = +d.lon;
  d.lat = +d.lat;
  return d;
}

draw_usmap();
