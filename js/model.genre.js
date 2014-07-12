/**
 * @fileOverview A Genre object represents a Genre node's information,
 * including a request name and a display name.
 */
function Genre(name, apiName) {
    var self = this;

    self.name = name;
    self.apiName = apiName;
};