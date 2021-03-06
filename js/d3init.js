/**
 * @fileOverview D3 graph drawing setup
 */


// D3 width and height (aspect)
var d3Width = 800;
var d3Height = 600;


// Moves a selection to the front in D3
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// The force graph
var force = d3.layout.force()
    .charge(-500)
    .linkDistance(250)
    .size([d3Width, d3Height]);

// The SVG to append.
var svg = d3.select("#interactive-pane").append("svg")
    .attr("viewBox", "0 0 " + d3Width + " " + d3Height)
    .attr("preserveAspectRatio", "xMidYMid meet");


//Updates D3 given new JSON data from Knockout
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

	// Node groups
	var gnodes = svg.selectAll('g.gnode')
	  .data(json.nodes)
	  .moveToFront();
	var enteredGNode = gnodes.enter().append('g')
	  .attr("class", "gnode")
	  .call(force.drag);
    gnodes.exit().remove();

	// Add a node to the group
	var node = enteredGNode.insert("circle")
	  .attr("class", function(d) {
        var resultClass;
        switch (d.nodeType) {
            case NODE_TYPES.GENRE:
                resultClass = "genreNode";
                break;
            case NODE_TYPES.ARTIST:
                resultClass = "artistNode";
                break;
            case NODE_TYPES.SONG:
                resultClass = "songNode";
                break;
        }
        return "node " + resultClass;
        })
	.attr("r", function(d) {
        var resultSize;
        switch (d.nodeType) {
            case NODE_TYPES.GENRE:
                resultSize = 30;
                break;
            case NODE_TYPES.ARTIST:
                resultSize = 25;
                break;
            case NODE_TYPES.SONG:
                resultSize = 20;
                break;
        }
        return resultSize;
    });

	// Add text to the group
	var text = enteredGNode.insert('text')
      .attr("dx", ".10em")
      .attr("dy", ".10em")
      .attr("font-size", function(d) {
        var resultSize;
        switch (d.nodeType) {
            case NODE_TYPES.GENRE:
                resultSize = "20";
                break;
            case NODE_TYPES.ARTIST:
                resultSize = "17";
                break;
            case NODE_TYPES.SONG:
                resultSize = "14";
                break;
        }
        return resultSize;
      })
      .attr("font-weight", "bold")
      .attr("font-family", "Yanone Kaffeesatz")
      .text(function(d) { return d.dataString.name; });

    if(text.node()) {
		var bbox = text.node().getBBox();
		var padding = 2;
		var rect = enteredGNode.insert("rect", "text")
		    .attr("x", bbox.x - padding)
		    .attr("y", bbox.y - padding)
		    .attr("width", bbox.width + (padding*2))
		    .attr("height", bbox.height + (padding*2));
    }

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
		d3.select(this).selectAll("node").attr("class", "activated");
		vm.nodeMouseOver(d);
	});
	enteredGNode.on('mouseout', function(d) {
		d3.select(this).selectAll("node").attr("class", "");
		vm.nodeMouseOut(d);
	});

}

// Knockout subscription to connect D3 to knockout.
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