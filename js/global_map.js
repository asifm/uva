function draw_globe() {
  var width = 1050;
  var height = 500;
  var centered;

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "map-tooltip")
    .style("position", "absolute")

  var radius = d3.scale.sqrt()
    .domain([1, 100])
    .range([3, 25])

  var projection = d3.geo.equirectangular()
    .translate([width / 2, height / 2 + 20])
    .scale(160)
    .clipExtent([
      [0, 0],
      [1050, 450]
    ]);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#world-map").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map-container")
    .on("click", clicked);


  var g = svg.append("g")

  d3.json("data/world-110m.json", function(error, world) {

    map_data = topojson.feature(world, world.objects.countries).features;

    d3.csv("data/ventures_by_country_id.csv", function(error, country_data) {
      var country_len = country_data.length;
      var map_len = map_data.length;

      for (var i = 0; i < country_len; i++) {
        for (var j = 0; j < map_len; j++) {
          if (map_data[j].id == country_data[i].id) {
            map_data[j].value = +country_data[i].value;
            map_data[j].lon = +country_data[i].lon;
            map_data[j].lat = +country_data[i].lat;
            map_data[j].name = country_data[i].name;
          }
        }
      }

      filt_data = map_data.filter(function(d) {
        return d.value;
      })

      g.selectAll("circle")
        .data(filt_data)
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

      g.selectAll("path")
        .data(map_data)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "country")
        .on("mouseenter", function(d) {
          if (d.value) {
            name = d.name
            value = d.value
            tooltip.html(name + " <b>" + value + "</b>")
              .style("left", (d3.event.pageX - 15) + "px")
              .style("top", (d3.event.pageY + 50) + "px")
              .style("opacity", 1)
          }
        })
        .on("mouseleave", function(d) {
          tooltip
            .style("opacity", 0);
        })
        .on("click", clicked);
    })
  })


function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
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
}


draw_globe();
