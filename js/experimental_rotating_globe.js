var width = 600,
  height = 600;

var projection = d3.geo.orthographic()
  .scale(300)
  .translate([width / 2, height / 2])
  .clipAngle(90);

var path = d3.geo.path()
  .projection(projection);

var λ = d3.scale.linear()
  .domain([0, width])
  .range([-180, 180]);

var φ = d3.scale.linear()
  .domain([0, height])
  .range([90, -90]);

var svg = d3.select("#globe")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + width / 2 + height / 2 + ")");

svg.on("mousemove", function() {
  var p = d3.mouse(this);
  projection.rotate([λ(p[0]), φ(p[1])]);
  svg.selectAll("path").attr("d", path);
});

svg.append("path")
  .datum({
    type: "Sphere"
  })
  .attr("id", "sphere")
  .attr("d", path);

d3.json("data/world-110m.json", function(error, world) {
  svg.append("path")
    .datum(topojson.feature(world, world.objects.land))
    .attr("class", "land")
    .attr("d", path)

  svg.on("click", function() {
    d3.select("#globe").select("svg").remove()
    d3.select("#flat-world").append("svg")
  })
});

