var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", function (d) {
    	// Update the view model
    	d.position.x(parseInt(d.position.x()) + d3.event.dx);
		d.position.y(parseInt(d.position.y()) + d3.event.dy);
		});

var updateD3 = function(data) {
    var nodes = d3.select("#buffer")
        .selectAll("circle")
        .data(data, function (d) { return d.name(); });


    nodes.enter()
        .append("rect")
        .attr("id", function (d) { return d.name(); })
        .attr("opacity", 0.0)
        .transition()
        .duration(1000)
        .attr("opacity", 0.5);


    nodes.attr("x", function (d) { return d.position.x(); })
        .attr("y", function (d) { return d.position.y(); })
        .attr("width", function (d) { return 20; })
        .attr("height", function (d) { return 20; })
        .call(drag);
    nodes.exit().remove();
}