/**
 * Created by morten on 27-02-16.
 */

"use strict";

var fs = require('fs'),
    init = require('./init'),
    http = require('http');

module.exports.fetch = function(date, hour, callback)
{
    if (date == undefined) {
        throw new Error("Date cannot be empty");
    }

    if (hour == undefined) {
        throw new Error("Hour cannot be empty");
    }

    var type = typeof(date);
    if (type != "string") {
        throw new Error("Date must be a string, '" + type + "' given");
    }

    type = typeof(hour);
    if (type != "string") {
        throw new Error("Hour must be a string, '" + type + "' given");
    }

    var cacheFile = `${init.settings.cacheDir}/${date}-${hour}.html`;
    fs.open(cacheFile, 'wx', function(err, fd) {
        if (err) {
            fs.readFile(cacheFile, (readErr, contents) => callback(readErr, contents));
        }
        else {
            var body;
            http.request(`${init.settings.baseUrl}?dato=${date}&time=${hour}`, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    callback(undefined, body);
                })
            }).end();
        }
    });
};