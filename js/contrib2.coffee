w = 600
h = 600

commaFormat = d3.format("0,000")

tooltip = d3.select "body"
    .append "div"
    .attr "class", "map-tooltip"
    .style "position", "absolute"

colorScale = d3.scale.ordinal()
          .domain ['Incorporated company'
                    'Partnership'
                    'Informal'
                    'Non-profit'
                    'Franchisee'
                    'Not reported'
                    'Sole proprietorship']
          .range ['steelblue'
                   'cornflowerblue'
                   'red'
                   'orange'
                   'limegreen'
                   'lightgray'
                   'green']

radScale = d3.scale.sqrt().domain([0, 12000]).range([0, 30])

pack = d3.layout.pack()
        .sort (a, b) -> b.value - a.value
        .size [w, h]
        .value (d) -> d.value
        .padding 2
        .radius (d) -> radScale(d)

svg = d3.select "#emp"
        .append "svg"
        .attr "width", w
        .attr "height", h

d3.csv 'data/all_vent_contrib.csv', ((d) -> {"value": d.employment, "name": d.typorg}), (dataCsv) ->
  # console.log dataCsv
  dataJson = d3.nest()
              .key (d) -> d.name
              .entries dataCsv

  dataJson.forEach (d) -> d.children = d.values

  # console.log(dataJson)

  nodes = pack.nodes {children: dataJson}
  # console.log(nodes)
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
          # d3.select(this).style("fill", "white")

      .on "mouseleave", (d) ->
        tooltip.style("opacity", 0)
        # d3.select(this).style("fill", "orange")

  return


  # d.max_revenue = +d.max_revenue
  # d.max_expend = +d.max_expend
  # d.employment = +d.employment
  # d.max_capital = +d.max_capital
  # console.log d

