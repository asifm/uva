// Generated by CoffeeScript 1.8.0
(function() {
  var colorScale, h, pack, radScale, svg, w;

  w = 900;

  h = 900;

  colorScale = d3.scale.ordinal().domain(['Incorporated company', 'Partnership', 'Informal', 'Non-profit', 'Franchisee', 'Not reported']).range(['steelblue', 'cornflowerblue', 'red', 'orange', 'limegreen', 'lightgray']);

  radScale = d3.scale.sqrt().domain([0, 12000]).range([0, 50]);

  pack = d3.layout.pack().sort(function(a, b) {
    return b.value - a.value;
  }).size([w, h]).value(function(d) {
    return d.value;
  }).padding(2).radius(function(d) {
    return radScale(d);
  });

  svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  d3.csv('data/all_vent_contrib.csv', (function(d) {
    return {
      "value": d.employment,
      "name": d.typorg
    };
  }), function(dataCsv) {
    var dataJson, nodes;
    console.log(dataCsv);
    dataJson = d3.nest().key(function(d) {
      return d.name;
    }).entries(dataCsv);
    dataJson.forEach(function(d) {
      return d.children = d.values;
    });
    nodes = pack.nodes({
      children: dataJson
    });
    svg.selectAll("circle").data(nodes).enter().append("circle").attr("r", function(d) {
      return d.r;
    }).attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).style("fill", function(d) {
      if (d.children) {
        return "white";
      } else {
        return colorScale(d.parent.key);
      }
    });
  });

}).call(this);