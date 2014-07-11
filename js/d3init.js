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
    .size([width, height]);

var svg = d3.select("#interactive-pane").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet");


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

	// Create the groups under svg
	var gnodes = svg.selectAll('g.gnode')
	  .data(json.nodes)
	var enteredGNode = gnodes.enter().insert('g')
	  .attr("class", "gnode")
	  .call(force.drag);
    gnodes.exit().remove();

	// Add one circle in each group
	var node = enteredGNode.insert("circle")
	  .attr("class", "node")
	  .attr("r", 30);

	var text = enteredGNode.insert('text')
      .attr("dx", ".10em")
      .attr("dy", ".10em")
      .text(function(d) { return d.dataString });


	// attach events
	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });

		// Translate the groups
	    gnodes.attr("transform", function(d) { 
		   return 'translate(' + [d.x, d.y] + ')'; 
		});    
	});

	enteredGNode.on('click', vm.clickNode);
	enteredGNode.on('mouseover', function(d) {
		link.style('stroke', function(l) {
			if (d === l.source || d === l.target)
				return '#ecf0f1';
			else
				return '#e67e22';
		});
		vm.nodeMouseOver(d);
	});
	enteredGNode.on('mouseout', function(d) {
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