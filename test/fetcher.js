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

function stubRequest(expected) {
    var request = this.stub(http, "request");
    var responseStream = new PassThrough();
    var requestStream = new PassThrough();

    if (expected) {
        responseStream.write(expected);
        responseStream.end();
    }

    request.callsArgWith(1, responseStream).returns(requestStream);

    return {
        'request': request,
        'stream': requestStream
    };
}

describe('fetcher', function() {
    describe("fetch", function() {
        before(function() {
            sinon.config = {
                useFakeTimers: false
            };
        });

        after(function() {
            sinon.config = {
                useFakeTimers: true
            };
        });

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

        it("should call with data from file, when date / hour already fetched", sinon.test(function(done) {
            var openError = { 'code': 'EEXIST' };
            var expected = "Hello, world!";

            this.stub(fs, "open").callsArgWith(2, openError);
            this.stub(fs, "readFile").callsArgWith(1, undefined, expected);

            fetcher.fetch("160205", "03", function(err, html) {
                (err == undefined).should.be.true();
                html.should.eql(expected);

                fs.open.should.be.called();
                fs.readFile.should.be.calledWith(init.settings.cacheDir + '/160205-03.html');

                done();
            });
        }));

        it("should attempt to fetch the URL, and attempt to write to file, passing the error", sinon.test(function(done) {
            var fd = {},
                writeError = { 'code': 'ENOSP' };
            this.stub(fs, "open").callsArgWith(2, undefined, fd);
            this.stub(fs, "writeFile").callsArgWith(2, writeError);

            var expected = "Hello, world!";
            var request = stubRequest.call(this, expected);

            var cacheFile = init.settings.cacheDir + "/160205-03.html";

            fetcher.fetch("160205", "03", function(err, html) {
                err.should.eql(writeError);
                (html == undefined).should.be.true();

                request.request.should.be.calledWith(init.settings.baseUrl + "?dato=160205&time=03");
                fs.open.should.be.calledWith(cacheFile);
                fs.writeFile.should.be.calledWith(cacheFile, expected);

                done();
            });
        }));

        it("should attempt to fetch the URL, and attempt to write to file, passing the contents", sinon.test(function(done) {
            var fd = {};
            this.stub(fs, "open").callsArgWith(2, undefined, fd);
            this.stub(fs, "writeFile").callsArgWith(2, undefined);

            var expected = "Hello, world!";
            var request = stubRequest.call(this, expected);
            var cacheFile = init.settings.cacheDir + "/160205-03.html";

            fetcher.fetch("160205", "03", function(err, html) {
                (err == undefined).should.be.true();
                html.should.eql(expected);

                request.request.should.be.calledWith(init.settings.baseUrl + "?dato=160205&time=03");
                fs.open.should.be.calledWith(cacheFile);
                fs.writeFile.should.be.calledWith(cacheFile, expected);

                done();
            });
        }));

        it("should pass along error when getData fails", sinon.test(function(done) {
            var fd = {};
            this.stub(fs, "open").callsArgWith(2, undefined, fd);
            this.stub(fs, "writeFile").callsArgWith(2, undefined);
            var expected = "Hello, world!";
            var request = stubRequest.call(this);

            fetcher.fetch("160205", "03", function(err, html) {
                err.should.eql(expected);
                (html == undefined).should.be.true();

                request.request.should.be.calledWith(init.settings.baseUrl + "?dato=160205&time=03");

                done();
            });

            request.stream.emit('error', expected);
        }));
    });

    describe("getData", function() {
        before(function() {
            sinon.config = {
                useFakeTimers: false
            };
        });

        after(function() {
            sinon.config = {
                useFakeTimers: true
            };
        });

        it("should throw an error when URL is empty", function() {
            (function() { fetcher.getData() }).should.throw("URL cannot be empty");
        });

        it("should request from URL", sinon.test(function(done) {
            var expected = "Hello, world!";
            var request = stubRequest.call(this, expected);

            fetcher.getData("http://google.com", function(err, body) {
                (err == undefined).should.be.true();
                body.should.eql(expected);

                request.request.should.be.calledWith("http://google.com");

                done();
            });
        }));

        it("should pass along error on error", sinon.test(function(done) {
            var expected = "Hello, world!";
            var request = stubRequest.call(this);

            fetcher.getData("http://google.com", (err, body) => {
                err.should.eql(expected);
                (body == undefined).should.be.true();

                request.request.should.be.calledWith("http://google.com");

                done();
            });

            request.stream.emit('error', expected);
        }));
    });
});