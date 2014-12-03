draw_contrib = (param) ->

  commaFormat = d3.format("0,000")

  tooltip = d3.select "body"
      .append "div"
      .attr "class", "map-tooltip"
      .style "position", "absolute"

  colorScale = d3.scale.ordinal()
      .domain [
              'Incorporated company'
              'Non-profit'
              'Partnership'
              'Sole proprietorship'
              'Franchisee'
              'Informal'
              'Not reported'
            ]
      .range [
              'steelblue'
              'orange'
              'slateblue'
              'green'
              'limegreen'
              'red'
              'lightgray'
            ]

  radScale = d3.scale.sqrt()
    .domain param.domainScale
    .range param.rangeScale

  pack = d3.layout.pack()
          .sort (a, b) -> b.value - a.value
          .size [param.w, param.h]
          .value (d) -> d.value
          .padding 2
          .radius (d) -> radScale(d)

  svg = d3.select param.idTarget
          .append "svg"
          .attr "width", param.w
          .attr "height", param.h

  dataJson = d3.nest()
              .key (d) -> d.name
              .entries param.contData[0]

  dataJson.forEach (d) -> d.children = d.values

  nodes = pack.nodes {children: dataJson}

  svg.selectAll "circle"
      .data nodes
      .enter()
      .append "circle"
      .attr "r", (d) -> d.r
      .attr "cx", (d) -> d.x
      .attr "cy", (d) -> d.y
      .style "fill", (d) -> if d.children then "white" else colorScale d.parent.key

      .on "mouseover", (d) ->
        if not d.children
          tooltip.html(d.name + " <b>" + commaFormat(d.value) + "</b>")
            .style("left", (d3.event.pageX - 15) + "px")
            .style("top", (d3.event.pageY + 50) + "px")
            .style("opacity", 1)

      .on "mouseleave", (d) ->
        tooltip.style("opacity", 0)

  return

d3.csv 'data/all_vent_contrib.csv',  (dataCsv) ->

  empData = [{"value": +d.employment, "name": d.typorg} for d in dataCsv]
  revData = [{"value": +d.max_revenue, "name": d.typorg} for d in dataCsv]
  expData = [{"value": +d.max_expend, "name": d.typorg} for d in dataCsv]
  capData = [{"value": +d.max_capital, "name": d.typorg} for d in dataCsv]

  draw_contrib
    w: 600
    h: 600
    domainScale: [0, 12000]
    rangeScale: [0, 30]
    idTarget: "#emp"
    contData: empData

  draw_contrib
    w: 600
    h: 600
    domainScale: [0, 15000000000]
    rangeScale: [0, 50]
    idTarget: "#rev"
    contData: revData

  draw_contrib
    w: 600
    h: 600
    domainScale: [0, 12000000000]
    rangeScale: [0, 50]
    idTarget: "#exp"
    contData: expData

  draw_contrib
    w: 600
    h: 600
    domainScale: [0, 30000000000]
    rangeScale: [0, 70]
    idTarget: "#cap"
    contData: capData

  return