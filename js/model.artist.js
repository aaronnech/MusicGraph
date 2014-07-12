/**
 * @fileOverview A Artist object represents a Artist node's information which
 * consists of the Spotify Artist record.
 */
function Artist(artist) {
    var self = this;

    self.name = artist.name;
    self.id = artist.id;
};