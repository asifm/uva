// Generated by CoffeeScript 1.8.0
(function() {
  var data, gradient, group, h, hMargin, svg, vMargin, w;

  data = {
    rev: {
      lo: "1.2T",
      mi: "1.6 Trillion",
      hi: "2.0T"
    },
    exp: {
      lo: "0.7T",
      mi: "0.9 Trillion",
      hi: "1.1T"
    },
    emp: {
      lo: "1.7M",
      mi: "2.3 Million",
      hi: "2.9M"
    },
    ccap: {
      lo: "1.6T",
      mi: "2.1 Trillion",
      hi: "2.7T"
    },
    revVa: {
      lo: "294B",
      mi: "395 Billion",
      hi: "505B"
    },
    expVa: {
      lo: "208B",
      mi: "279 Billion",
      hi: "356B"
    },
    empVa: {
      lo: "278K",
      mi: "371 Thousand",
      hi: "477K"
    },
    ccapVa: {
      lo: "124B",
      mi: "167 Billion",
      hi: "213B"
    }
  };

  w = 300;

  h = 40;

  vMargin = 40;

  hMargin = 50;

  function draw_extrap(kind) {

    svg = d3.select("#" + kind).append("svg:svg").attr("width", w + hMargin).attr("height", h + vMargin).attr("display", "block").classed("center", true);

    gradient = svg.append("svg:defs").append("svg:linearGradient").attr("id", "gradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "270%").attr("y2", "50%").attr("spreadMethod", "pad");

    gradient.append("svg:stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", 1);

    if (kind === "emp" || kind === "rev" || kind === "exp" || kind === "ccap") {
      gradient.append("svg:stop").attr("offset", "100%").attr("stop-color", "#235281").attr("stop-opacity", 1);
    } else {
      gradient.append("svg:stop").attr("offset", "100%").attr("stop-color", "#CF7800").attr("stop-opacity", 1);
    }

    group = svg.append("g").attr("transform", "translate(" + (hMargin / 2) + ", " + (vMargin / 2) + ")");

    group.append("svg:rect").attr("width", w).attr("height", h).style("fill", "url(#gradient)");

    group.append("text").attr("text-anchor", "middle").attr("x", 0).attr("x", "2em").attr("y", h / 2).attr("dy", ".5em").text(data[kind].lo);

    group.append("text").attr("text-anchor", "middle").attr("x", 0).attr("x", "2em").attr("y", h).attr("dy", ".8em").text("Low estimate");

    group.append("text").attr("text-anchor", "middle").attr("x", w).attr("dx", "-2em").attr("y", h / 2).attr("dy", ".5em").text(data[kind].hi);

    group.append("text").attr("text-anchor", "middle").attr("x", w).attr("dx", "-2em").attr("y", h).attr("dy", ".8em").text("High estimate");

    group.append("text").attr("text-anchor", "middle").attr("font-family", "open sans").attr("font-size", "30px").attr("font-variant", "small-caps").attr("x", w / 2).attr("y", h / 2).attr("dy", ".4em").text(data[kind].mi);
  }

  draw_extrap("emp")
  draw_extrap("rev")
  draw_extrap("exp")
  draw_extrap("ccap")
  draw_extrap("revVa")
  draw_extrap("expVa")
  draw_extrap("empVa")
  draw_extrap("ccapVa")
}).call(this);