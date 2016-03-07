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

       it("should return empty array on undefined input", sinon.test(function(done) {
           parser.parseHtml(undefined, (res) => {
               res.should.eql([]);

               done();
           });
       }));

       it("should return empty array on empty input", sinon.test(function(done) {
           parser.parseHtml("", (res) => {
               res.should.eql([]);

               done();
           })
       }));

       it("should find divs with bottom margin only", sinon.test(function(done) {
           parser.parseHtml('<div><div style="margin-top: 6px; margin-bottom: 10px; font-weight: bold;"><span>Test</span>Test 2</div><div style="margin-bottom: 2px;"><span>Test 3</span>Test 4</div></div>',  (res) => {
               res.should.eql([
                   {
                       'inDiv': false,
                       'inSpan': false,
                       'time': 'Test 3',
                       'song': 'Test 4'
                   }
               ]);

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