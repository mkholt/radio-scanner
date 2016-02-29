/**
 * Created by morten on 27-02-16.
 */

"use strict";

var should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    http = require('http'),
    PassThrough = require('stream').PassThrough,
    fetcher = require('../lib/fetcher'),
    init = require('../lib/init.js')
    ;
require('should-sinon');

describe('fetcher', function() {
    var sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create()
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe("fetch", function() {
        it("should throw an error when date is empty", function() {
            (function() { fetcher.fetch(); }).should.throw("Date cannot be empty");
        });

        it("should throw an error when date is not a string", function() {
            (function() { fetcher.fetch(160205, "03"); }).should.throw("Date must be a string, 'number' given");
        });

        it("should throw an error when hour is empty", function() {
            (function() { fetcher.fetch("160205"); }).should.throw("Hour cannot be empty");
        });

        it("should throw an error when hour is not a string", function() {
            (function() { fetcher.fetch("160205", 3); }).should.throw("Hour must be a string, 'number' given");
        });

        it("should call with data from file, when date / hour already fetched", function() {
            var openError = { 'code': 'EEXIST' };
            var expected = fs.readFileSync('./test/fetch-data.html');

            sandbox.stub(fs, "open").callsArgWith(2, openError);
            sandbox.stub(fs, "readFile").callsArgWith(1, undefined, expected);

            fetcher.fetch("160205", "03", function(err, html) {
                (err == undefined).should.be.true();

                fs.open.should.be.called();
                fs.readFile.should.be.calledWith(init.settings.cacheDir + '/160205-03.html');

                html.should.be.eql(expected);
            });
        });

        it("should attempt to fetch the URL, and attempt to write to file", function() {
            var fd = {};
            sandbox.stub(fs, "open").callsArgWith(2, undefined, fd);
            sandbox.stub(fs, "write").callsArgWith(2, { 'code': 'ENOSP' });

            var request = sandbox.stub(http, "request");

            var expected = fs.readFileSync('./test/fetch-data.html');
            var response = new PassThrough();
            response.write(expected);
            response.end();

            request.callsArgWith(1, response).returns(new PassThrough());

            fetcher.fetch("160205", "03", function(err, html) {
                (err == undefined).should.be.true();

                request.should.be.calledWith(init.settings.baseUrl + "?dato=160205&time=03");
                fs.open.should.be.calledWith(init.settings.cacheDir + "/160205-03.html");
                fs.write.should.be.calledWith(fd, expected);

                html.should.be.eql(expected);
            });
        });
    });
});