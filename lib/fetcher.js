/**
 * Created by morten on 27-02-16.
 */

"use strict";

var fs = require('fs'),
    init = require('./init'),
    http = require('http');

function fetch(date, hour, callback)
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
            getData(`${init.settings.baseUrl}?dato=${date}&time=${hour}`, (err, body) => {
                if (err) {
                    callback(err);
                    return;
                }

                fs.writeFile(cacheFile, body, err => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(undefined, body);
                    }
                });
            });
        }
    });
}

function getData(url, callback)
{
    if (!url) {
        throw new Error("URL cannot be empty");
    }

    var body = "";
    http.request(url, (res) => {
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            callback(undefined, body);
        });
    }).on('error', err => callback(err)).end();
}

module.exports.fetch = fetch;
module.exports.getData = getData;