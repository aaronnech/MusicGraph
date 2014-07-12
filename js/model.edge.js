/**
 * @fileOverview An Edge is a connection between two nodes.
 */
function Edge(source, target) {
    var self = this;

    self.source = source;
    self.target = target;
    self.weight = 1;
};