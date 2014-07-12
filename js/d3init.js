var width = 800;
var height = 600;

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(200)
    .size([width, height])

var svg = d3.select("#interactive-pane").append("svg")
    .attr("width", width)
    .attr("height", height);


var updateD3 = function(json) {
	force
	  .nodes(json.nodes)
	  .links(json.links)
	  .start();

	var link = svg.selectAll("line.link")
	  .data(json.links, function(d) { return d.source.id() + '-' + d.target.id(); });
	link.enter().append("line")
	  .attr("class", "link");
	link.exit().remove();

	var node = svg.selectAll("circle.node")
	  .data(json.nodes, function(d) { return d.id(); });
	node.enter().append("circle")
	  .attr("class", "node")
	  .attr("r", 30)
	  .moveToFront()
	  .call(force.drag);
	node.exit().remove();

	node.append("title")
	  .text(function(d) { return d.id(); });

	// attach events
	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });

		node.attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; });
	});

	node.on('click', vm.clickNode);
	node.on('mouseover', function(d) {
		link.style('stroke', function(l) {
			if (d === l.source || d === l.target)
				return '#ecf0f1';
			else
				return '#e67e22';
		});
		vm.nodeMouseOver(d);
	});
	node.on('mouseout', function(d) {
		link.style('stroke', '#e67e22');
		vm.nodeMouseOut(d);
	});

}


var d3Subs = [];
vm.nodes.subscribe(function (newNodes) {
    updateD3({
    	'nodes' : newNodes,
    	'links' : vm.edges()
    });
    ko.utils.arrayForEach(d3Subs, function (sub) { sub.dispose(); });
    ko.utils.arrayForEach(newNodes, function (node) {
        d3Subs.push(node.toD3.subscribe(function () {
		    updateD3({
		    	'nodes' : newNodes,
		    	'links' : vm.edges()
		    });
        }));
    });
});