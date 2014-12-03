// Generated by CoffeeScript 1.8.0
(function() {
  var draw_contrib;

  draw_contrib = function(param) {
    var colorScale, commaFormat, dataJson, nodes, pack, radScale, svg, tooltip;
    commaFormat = d3.format("0,000");
    tooltip = d3.select("body").append("div").attr("class", "map-tooltip").style("position", "absolute");
    colorScale = d3.scale.ordinal().domain(['Incorporated company', 'Partnership', 'Informal', 'Non-profit', 'Franchisee', 'Not reported', 'Sole proprietorship']).range(['steelblue', 'slateblue', 'red', 'orange', 'limegreen', 'lightgray', 'green']);
    radScale = d3.scale.sqrt().domain(param.domainScale).range(param.rangeScale);
    pack = d3.layout.pack().sort(function(a, b) {
      return b.value - a.value;
    }).size([param.w, param.h]).value(function(d) {
      return d.value;
    }).padding(2).radius(function(d) {
      return radScale(d);
    });
    svg = d3.select(param.idTarget).append("svg").attr("width", param.w).attr("height", param.h);
    dataJson = d3.nest().key(function(d) {
      return d.name;
    }).entries(param.contData[0]);
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
    }).on("mouseover", function(d) {
      if (!d.children) {
        return tooltip.html(d.name + " <b>" + commaFormat(d.value) + "</b>").style("left", (d3.event.pageX - 15) + "px").style("top", (d3.event.pageY + 50) + "px").style("opacity", 1);
      }
    }).on("mouseleave", function(d) {
      return tooltip.style("opacity", 0);
    });
  };

  d3.csv('data/all_vent_contrib.csv', function(dataCsv) {
    var capData, d, empData, expData, revData;
    empData = [
      (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = dataCsv.length; _i < _len; _i++) {
          d = dataCsv[_i];
          _results.push({
            "value": +d.employment,
            "name": d.typorg
          });
        }
        return _results;
      })()
    ];
    revData = [
      (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = dataCsv.length; _i < _len; _i++) {
          d = dataCsv[_i];
          _results.push({
            "value": +d.max_revenue,
            "name": d.typorg
          });
        }
        return _results;
      })()
    ];
    expData = [
      (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = dataCsv.length; _i < _len; _i++) {
          d = dataCsv[_i];
          _results.push({
            "value": +d.max_expend,
            "name": d.typorg
          });
        }
        return _results;
      })()
    ];
    capData = [
      (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = dataCsv.length; _i < _len; _i++) {
          d = dataCsv[_i];
          _results.push({
            "value": +d.max_capital,
            "name": d.typorg
          });
        }
        return _results;
      })()
    ];
    draw_contrib({
      w: 600,
      h: 600,
      domainScale: [0, 12000],
      rangeScale: [0, 30],
      idTarget: "#emp",
      contData: empData
    });
    draw_contrib({
      w: 600,
      h: 600,
      domainScale: [0, 15000000000],
      rangeScale: [0, 50],
      idTarget: "#rev",
      contData: revData
    });
    draw_contrib({
      w: 600,
      h: 600,
      domainScale: [0, 12000000000],
      rangeScale: [0, 50],
      idTarget: "#exp",
      contData: expData
    });
    draw_contrib({
      w: 600,
      h: 600,
      domainScale: [0, 30000000000],
      rangeScale: [0, 70],
      idTarget: "#cap",
      contData: capData
    });
  });

}).call(this);
