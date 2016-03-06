/**
 * Created by morten on 06-03-16.
 */

"use strict";

var parser = require('htmlparser2');

function parseHtml(html, callback) {
    callback({});
}

function splitTitle(title) {
    throw new Error("Not implemented");
}

function parseArtist(artist) {
    throw new Error("Not implemented");
}


function parseTitle(title) {
    throw new Error("Not implemented");
}

module.exports.parseHtml = parseHtml;
module.exports.splitTitle = splitTitle;
module.exports.parseArtist = parseArtist;
module.exports.parseTitle = parseTitle;