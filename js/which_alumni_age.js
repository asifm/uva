function draw_chart_age(param) {
    var width = param.w - param.margin.left - param.margin.right; // width of the chart
    var height = param.h - param.margin.top - param.margin.bottom;

    var x = d3.scale.linear()
        .domain([24, 84])
        .range([0, width])

    var y = d3.scale.linear()
        .domain([0, d3.max(param.data, function(d) {
            return d3.max([d.ent, d.nent]);
        })])
        .range([height, 0])

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(10)

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(4);

    // data.sort(function(a, b) {
    //     return a.age - b.age;
    // })

    var svg = d3.select(param.id)
        .append("svg")
        .attr("width", width + param.margin.left + param.margin.right)
        .attr("height", height + param.margin.top + param.margin.bottom)

    var chart = svg.append("g")
        .attr("transform", "translate(" + param.margin.left + "," + param.margin.top + ")")

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    function render_line(elements_to_select, class_to_apply, data_to_select) {

        var area = d3.svg.area()
            .x(function(d) {
                return x(d.age);
            })
            .y0(height)
            .y1(function(d) {
                return y(d[data_to_select]);
            })
            .interpolate("cardinal");

        var group = chart.append("path")
            .datum(param.data)
            .attr("class", class_to_apply)
            .classed("area", true)
            .attr("d", function(d) {
                return area(d);
            });

        svg.on("mouseenter", function() {
                d3.selectAll(".ratio")
                    .transition()
                    .duration(500)
                    .style("opacity", 1);
                d3.selectAll(".area")
                    .transition()
                    .duration(2000)
                    .style("opacity", "0.2")
            })
            .on("mouseleave", function() {
                d3.selectAll(".ratio")
                    .transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.selectAll(".area")
                    .transition()
                    .duration(2000)
                    .style("opacity", "0.9")
            })
    }

    render_line("path .nent", "nent-area", "nent")
    render_line("path .ent", "ent-area", "ent")

    chart.append("svg:text")
        .text("Number of alumni")
        .attr("class", "axis-label")
        .attr("transform", "translate(-50," + height / 2 + ") rotate(-90)");

    chart.append("svg:text")
        .text("Age of alumni")
        .attr("class", "axis-label")
        .attr("transform", "translate(" + width / 2 + ", " + height + ")")
        .attr("dy", "3em")

    chart.append("svg:text")
        .text("Non-entrepreneurs")
        .attr("class", "axis-label")
        .attr("transform", "translate(80, 120)")

    chart.append("svg:text")
        .text("Entrepreneurs")
        .attr("class", "axis-label")
        .attr("transform", "translate(80, " + height + ")")
        .attr("dy", "-2em")

    y_ratio = d3.scale.linear()
        .domain([0, 1])
        .range([height, 0]);

    line = d3.svg.line()
        .x(function(d) {
            return x(d.age);
        })
        .y(function(d) {
            return y_ratio(d.ratio)
        })
        .interpolate("cardinal");

    var yAxis_ratio = d3.svg.axis()
        .scale(y_ratio)
        .orient("right")
        .ticks(5);

    chart.append("g")
        .attr("transform", "translate(" + width + ", 0)")
        .attr("class", "y axis")
        .call(yAxis_ratio)
        .classed("ratio", true)
        .style("opacity", 0);

    chart.append("svg:path")
        .datum(param.data)
        .attr("class", "line")
        .classed("ratio", true)
        .attr("d", line)
        .style("opacity", 0);

    chart.append("text")
        .text("Ratio of Entrepreneurs to Non-entrepreneurs")
        .attr("class", "axis-label")
        .classed("ratio", true)
        .attr("x", width - 150)
        .attr("y", 30)
        .style("opacity", 0);
}

function type(d) {
    d.age = +d.age;
    d.ent = +d.ent;
    d.nent = +d.nent;
    d.ratio = +d.ratio;
    return d;
}

d3.csv("../data/age.csv", type, function(error, data) {
    draw_chart_age({
        data: data,
        id: "#age",
        w: 500,
        h: 300,
        margin: {
            top: 20,
            right: 60,
            bottom: 40,
            left: 60
        }
    });
});
