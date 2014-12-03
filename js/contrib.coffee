w = 900
h = 900

#TODO change color codes according the color palette
colorScale = d3.scale.ordinal()
          .domain ['Incorporated company'
                    'Partnership'
                    'Informal'
                    'Non-profit'
                    'Franchisee'
                    'Not reported']
          .range ['steelblue'
                   'cornflowerblue'
                   'red'
                   'orange'
                   'limegreen'
                   'lightgray']

radScale = d3.scale.sqrt().domain([0, 12000]).range([0, 50])

pack = d3.layout.pack()
        .sort (a, b) -> b.value - a.value
        .size [w, h]
        .value (d) -> d.value
        .padding 2
        .radius (d) -> radScale(d)

svg = d3.select "body"
        .append "svg"
        .attr "width", w
        .attr "height", h

d3.csv 'data/all_vent_contrib.csv', ((d) -> {"value": d.employment, "name": d.typorg}), (dataCsv) ->
  console.log dataCsv
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
      # .on "mouseover", (d) ->

      # .style("opacity", 0.3)
      # .style "stroke", "black"
      # .style "stroke-width", 0.3
  return


  # d.max_revenue = +d.max_revenue
  # d.max_expend = +d.max_expend
  # d.employment = +d.employment
  # d.max_capital = +d.max_capital
  # console.log d

