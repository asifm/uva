function draw_globe (){
  var width = 960,
  height = 500;

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "map-tooltip")
  .style("position", "absolute")

var zoom = d3.behavior.zoom()
  .scaleExtent([1, 8])
  .on("zoom", move);

var radius = d3.scale.sqrt()
  .domain([1, 100])
  .range([3, 25])

var projection = d3.geo.equirectangular()
  .translate([width / 2, height / 2 + 20])
  .scale(150)
  .clipExtent([
    [0, 0],
    [960, 440]
  ]);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("#flat-world").append("svg")
  .attr("width", width)
  .attr("height", height)
  .call(zoom);

var g = svg.append("g")

g.append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "map-container");

d3.json("data/world-110m.json", function(error, world) {

  map_data = topojson.feature(world, world.objects.countries).features;

  d3.csv("data/map_world.csv", function(error, country_data) {
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
      .attr("class", "world-circle")
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
      .attr("class", "country")
      .attr("d", path)
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
  })
})
  function move() {
    var t = d3.event.translate,
      s = d3.event.scale;
    t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
    t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
  }
}

draw_globe();


btn = d3.select("#full-map")

btn.on("click", function(){
  d3.select("#flat-world").select("svg").remove()
  draw_globe();
})