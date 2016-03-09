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

       it("should return empty array when no matches", sinon.test(function(done) {
          parser.parseHtml("<div>No match</div>", (res) => {
              res.should.eql([]);

              done();
          });
       }));

       it("should find divs with bottom margin only", sinon.test(function(done) {
           var song = "";
           parser.parseHtml('<div><div style="margin-top: 6px; margin-bottom: 10px; font-weight: bold;"><span>Test</span>Test 2</div><div style="margin-bottom: 2px;"><span>Test 3</span>Test 4</div></div>',  (res) => {
               res.should.eql([
                   {
                       'time': 'Test 3',
                       'song': parser.splitTitle('Test 4')
                   }
               ]);

               done();
           });
       }));

       it("should find multiple songs", sinon.test(function(done) {
           parser.parseHtml('<div><div style="margin-bottom: 2px;"><span>Test</span>Test 2</div><div style="margin-bottom: 2px;"><span>Test 3</span>Test 4</div></div>',  (res) => {
               res.should.eql([
                   {
                       'time': 'Test',
                       'song': parser.splitTitle('Test 2')
                   },
                   {
                       'time': 'Test 3',
                       'song': parser.splitTitle('Test 4')
                   }
               ]);

               done();
           });
       }));
   });

    describe("splitTitle", function() {
        it("should split on dash, with spaces", function() {
            parser.splitTitle("Artist - Title").should.eql(["Artist", "Title"]);
        });

        it("should split on dash, without spaces", function() {
           parser.splitTitle("Artist-Title").should.eql(["Artist","Title"]);
        });

        it("should split on spaced dash, if present", function() {
            parser.splitTitle("Long-Artist - Title").should.eql(["Long-Artist","Title"]);
        });

        it("should split on the first spaced, or unspaced, dash", function() {
            parser.splitTitle("Artist - Title - Remix").should.eql(["Artist","Title - Remix"]);
            parser.splitTitle("Artist - Title-Remix").should.eql(["Artist","Title-Remix"]);
            parser.splitTitle("Artist-Title-Remix").should.eql(["Artist","Title-Remix"]);
            parser.splitTitle("Long-Artist - Title-Remix").should.eql(["Long-Artist","Title-Remix"]);
            parser.splitTitle("Long-Artist - Title - Remix").should.eql(["Long-Artist","Title - Remix"]);
        });
    });

    describe("parseArtist", function() {
    });

    describe("parseTitle", function() {

    });
});