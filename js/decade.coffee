percentFormat = d3.format ".0%"
commaFormat = d3.format "0,000"

d3.csv "../data/ventures_by_decade.csv", (data) ->

  totalData = ({name: e.name, value: +e.value_total, freq: +e.freq_total, kind: e.kind} for e in data)
  data_1960s = ({name: e.name, value: +e.value_1960s, freq: +e.freq_1960s, kind: e.kind} for e in data)
  data_1970s = ({name: e.name, value: +e.value_1970s, freq: +e.freq_1970s, kind: e.kind} for e in data)
  data_1980s = ({name: e.name, value: +e.value_1980s, freq: +e.freq_1980s, kind: e.kind} for e in data)
  data_1990s = ({name: e.name, value: +e.value_1990s, freq: +e.freq_1990s, kind: e.kind} for e in data)
  data_2000s = ({name: e.name, value: +e.value_2000s, freq: +e.freq_2000s, kind: e.kind} for e in data)
  data_2010s = ({name: e.name, value: +e.value_2010s, freq: +e.freq_2010s, kind: e.kind} for e in data)


  decadeTotal = [{decade: '1960s', value: 119}, {decade: '1970s', value: 494},
   {decade:'1980s', value: 1310}, {decade: '1990s', value: 2147},
   {decade: '2000s', value: 3341}, {decade: '2010s', value: 1233}]

  margin =
    top: 30
    right: 0
    bottom: 30
    left: 0

  w = 500
  h = 300

  width = w - margin.left - margin.right
  height = h - margin.top - margin.bottom

  x = d3.scale.ordinal()
    .domain decadeTotal.map (d) -> d.decade
    .rangeRoundBands [0, width], .25

  y = d3.scale.linear()
    .domain [0, 3341]
    .range [height, 0]

  xAxis = d3.svg.axis()
      .scale x
      .orient "bottom"

  yAxis = d3.svg.axis()
      .scale y
      .orient "left"
      .tickFormat commaFormat

  svg = d3.select "#decades"
      .append "svg"
      .attr "width", width + margin.left + margin.right
      .attr "height", height + margin.top + margin.bottom
      .attr "display", "block"
      .classed "center", true

  chart = svg.append "g"
      .attr "transform", "translate(#{margin.left}, #{margin.top})"

  chart.append "g"
      .attr "class", "x axis"
      .attr "transform", "translate(0, #{height})"
      .call xAxis

  # chart.append "g"
  #     .attr "class", "y axis"
  #     .call yAxis

  barGroup = chart.selectAll ".bargroup"
      .data decadeTotal
      .enter().append "g"
      .classed("bargroup", true)

  barGroup.append "rect"
      .attr "class", "decade_bar"
      .attr "x", (d) -> x d.decade
      .attr "y", (d) -> y d.value
      .attr "width", x.rangeBand()
      .attr "height", (d) -> height - y d.value
      .on "mouseenter", ->
        d3.select(this)
              .transition()
              .style "opacity", .3
      .on "mouseleave", ->
        d3.select(this)
              .transition()
              .style "opacity", 1
      .on "click", -> drawDecade d3.select(this).datum().decade

  barGroup.append "text"
      .attr "class", "text-on-bar"
      .attr "x", (d) -> x d.decade
      .attr "text-anchor", "middle"
      .attr "dx", x.rangeBand()/2
      .attr "y", (d) -> y d.value
      .attr "dy", "-1.2em"
      .text (d) -> commaFormat d.value
      .style "opacity", 1


  drawDecade = (decade) ->
    #d TODO decadeData = totalData if not decade?
    decadeData = data_1960s if decade is '1960s'
    decadeData = data_1970s if decade is '1970s'
    decadeData = data_1980s if decade is '1980s'
    decadeData = data_1990s if decade is '1990s'
    decadeData = data_2000s if decade is '2000s'
    decadeData = data_2010s if decade is '2010s'

    renderBar
      data: decadeData
      kind: "legal"
      w: 500
      h: 260
      targetId: "#legal"
      margin:
        top: 20
        right: 50
        bottom: 40
        left: 160

    renderBar
      data: decadeData
      kind: "status"
      w: 500
      h: 150
      targetId: "#status"
      margin:
        top: 20
        right: 50
        bottom: 40
        left: 300

    renderBar
      data: decadeData
      kind: "ind"
      w: 700
      h: 250
      targetId: "#ind"
      margin:
        top: 20
        right: 50
        bottom: 40
        left: 350
    return

renderBar = (param) ->

  d3.select param.targetId
      .select "svg"
      .remove()

  data = filterData param.kind, param.data

  width = param.w - param.margin.left - param.margin.right
  height = param.h - param.margin.top - param.margin.bottom

  x = d3.scale.linear()
    .domain [0, d3.max data, (d) -> d.freq]
    .range [0, width]

  y = d3.scale.ordinal()
    .domain data.map (d) -> d.name
    .rangeRoundBands [0, height], .1

  xAxis = d3.svg.axis()
      .scale x
      .orient "bottom"

      .tickFormat percentFormat

  if param.kind is "status" then xAxis.ticks 3 else xAxis.ticks 6

  yAxis = d3.svg.axis()
      .scale y
      .orient "left"

  svg = d3.select param.targetId
      .append "svg"
      .attr "width", width + param.margin.left + param.margin.right
      .attr "height", height + param.margin.top + param.margin.bottom

  chart = svg.append "g"
      .attr "transform", "translate(#{param.margin.left}, #{param.margin.top})"

  chart.append "g"
      .attr "class", "x axis"
      .attr "transform", "translate(0, #{height})"
      .call xAxis

  chart.append "g"
      .attr "class", "y axis"
      .call yAxis

  barGroup = chart.selectAll ".bargroup"
      .data data
      .enter().append "g"
      .classed("bargroup", true)

  barGroup.append "rect"
      .attr "class", "decade_small_bar"
      .attr "y", (d) -> y d.name
      .attr "height", y.rangeBand()
      .attr "width", 0
      .transition()
      .duration(400)
      .attr "width", (d) -> x d.freq

  barGroup.append "text"
      .attr "class", "text-on-bar"
      .attr "x", (d) -> x d.freq
      .attr "dx", ".2em"
      .attr "y", (d) -> y d.name
      .attr "dy", y.rangeBand()/2
      .text (d) -> commaFormat d.value
      .style "opacity", 0
      .transition()
      .duration(600)
      .style "opacity", 1
  return


filterData = (kind, data) ->
  filteredData = data.filter (d) -> d.kind is kind
  if kind is "ind"
    filteredData.sort (a, b) -> b.value - a.value
    filteredData = filteredData.filter (e) -> e.name isnt "Non-Profit"
    filteredData = filteredData.filter (e, i) -> i <= 5
  filteredData