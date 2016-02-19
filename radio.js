/**
 * Created by morten on 11-02-16.
 */

'use strict';

var http = require('http');
var parser = require('htmlparser2');
var init = require('./lib/init');

var dates = [
    "160205"
];

var times = [
    "03"
];

init.setup();

/*dates.forEach((date) => {
    times.forEach((time) => {


        var body;
        http.request(`http://radioabc.dk/playlist/default.asp?dato=${date}&time=${time}`, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {

            })
        }).end();
    });
});*/

