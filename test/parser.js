/**
 * Created by morten on 06-03-16.
 */

"use strict";

var should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    init = require('../lib/init.js'),
    parser = require('../lib/parser.js')
    ;
require('should-sinon');

describe('parser', function() {
   describe('parseHtml', function() {
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

       it("should return empty object on undefined input", sinon.test(function(done) {
           parser.parseHtml(undefined, (res) => {
               res.should.eql({});

               done();
           });
       }));

       it("should return empty object on empty input", sinon.test(function(done) {
           parser.parseHtml("", (res) => {
               res.should.eql({});

               done();
           })
       }));

       it("should return empty object on invalid input", sinon.test(function(done) {
           parser.parseHtml("invalid html", (res) => {
               res.should.eql({});

               done();
           });
       }));
   });

    describe("splitTitle", function() {

    });

    describe("parseArtist", function() {

    });

    describe("parseTitle", function() {

    });
});