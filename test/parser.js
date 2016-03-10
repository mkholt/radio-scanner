/**
 * Created by morten on 06-03-16.
 */

"use strict";

var should = require('should'),
    sinon  = require('sinon'),
    fs     = require('fs'),
    init   = require('../lib/init.js'),
    parser = require('../lib/parser.js')
	;
require('should-sinon');

describe('parser', function ()
{
	describe('parseHtml', function ()
	{
		before(function ()
		{
			sinon.config = {
				useFakeTimers: false
			};
		});

		after(function ()
		{
			sinon.config = {
				useFakeTimers: true
			};
		});

		it("should return empty array on undefined input", sinon.test(function (done)
		{
			parser.parseHtml(undefined, (res) =>
			{
				res.should.eql([]);

				done();
			});
		}));

		it("should return empty array on empty input", sinon.test(function (done)
		{
			parser.parseHtml("", (res) =>
			{
				res.should.eql([]);

				done();
			})
		}));

		it("should return empty array when no matches", sinon.test(function (done)
		{
			parser.parseHtml("<div>No match</div>", (res) =>
			{
				res.should.eql([]);

				done();
			});
		}));

		it("should find divs with bottom margin only", sinon.test(function (done)
		{
			var song      = "Flo Rida feat. Robin Thicke & Verdine Wh - I don't like it, I love it",
			    songParts = parser.splitTitle(song),
			    artist    = parser.parseArtist(songParts[0]),
			    title     = parser.parseTitle(songParts[1]),
			    expected  = [
				    {
					    'time':   'Test 3',
					    'song':   song,
					    'artist': artist,
					    'title':  title
				    }
			    ];

			parser.parseHtml(`<div><div style="margin-top: 6px; margin-bottom: 10px; font-weight: bold;"><span>Test</span>Test 2</div><div style="margin-bottom: 2px;"><span>Test 3</span>${song}</div></div>`, (res) =>
			{
				res.should.eql(expected);

				done();
			});
		}));

		it("should find multiple songs", sinon.test(function (done)
		{
			var songOne = "Flo Rida feat. Robin Thicke & Verdine Wh - I don't like it, I love it";
			var songTwo = "Calvin Harris + Disciples - How Deep Is Your Love";

			var songOneParts = parser.splitTitle(songOne);
			var songTwoParts = parser.splitTitle(songTwo);

			var artistOne = parser.parseArtist(songOneParts[0]);
			var artistTwo = parser.parseArtist(songTwoParts[0]);

			var titleOne = parser.parseTitle(songOneParts[1]);
			var titleTwo = parser.parseTitle(songTwoParts[1]);

			var expected = [
				{
					'time':   'Test',
					'song':   songOne,
					'artist': artistOne,
					'title':  titleOne
				},
				{
					'time':   'Test 3',
					'song':   songTwo,
					'artist': artistTwo,
					'title':  titleTwo
				}
			];

			parser.parseHtml(`<div><div style="margin-bottom: 2px;"><span>Test</span>${songOne}</div><div style="margin-bottom: 2px;"><span>Test 3</span>${songTwo}</div></div>`, (res) =>
			{
				res.should.eql(expected);

				done();
			});
		}));
	});

	describe("splitTitle", function ()
	{
		it("should split on dash, with spaces", function ()
		{
			parser.splitTitle("Artist - Title")
			      .should
			      .eql(["Artist", "Title"]);
		});

		it("should split on dash, without spaces", function ()
		{
			parser.splitTitle("Artist-Title")
			      .should
			      .eql(["Artist", "Title"]);
		});

		it("should split on spaced dash, if present", function ()
		{
			parser.splitTitle("Long-Artist - Title")
			      .should
			      .eql(["Long-Artist", "Title"]);
		});

		it("should split on the first spaced, or unspaced, dash", function ()
		{
			parser.splitTitle("Artist - Title - Remix")
			      .should
			      .eql(["Artist", "Title - Remix"]);

			parser.splitTitle("Artist - Title-Remix")
			      .should
			      .eql(["Artist", "Title-Remix"]);

			parser.splitTitle("Artist-Title-Remix")
			      .should
			      .eql(["Artist", "Title-Remix"]);

			parser.splitTitle("Long-Artist - Title-Remix")
			      .should
			      .eql(["Long-Artist", "Title-Remix"]);

			parser.splitTitle("Long-Artist - Title - Remix")
			      .should
			      .eql(["Long-Artist", "Title - Remix"]);
		});

		it("should split on live data", function ()
		{
			parser.splitTitle("The Weeknd - Ïn the night")
			      .should
			      .eql(["The Weeknd", "Ïn the night"]);

			parser.splitTitle("Calvin Harris + Disciples - How Deep Is Your Love")
			      .should
			      .eql(["Calvin Harris + Disciples", "How Deep Is Your Love"]);

			parser.splitTitle("Imagine Dragons - Shots")
			      .should
			      .eql(["Imagine Dragons", "Shots"]);

			parser.splitTitle("TooManyLeftHands - Too young to die")
			      .should
			      .eql(["TooManyLeftHands", "Too young to die"]);

			parser.splitTitle("Uso feat. Johnson - Supermayn")
			      .should
			      .eql(["Uso feat. Johnson", "Supermayn"]);

			parser.splitTitle("Ellie Goulding - Something in the way you move")
			      .should
			      .eql(["Ellie Goulding", "Something in the way you move"]);

			parser.splitTitle("Rasmus Seebach - Natteravn")
			      .should
			      .eql(["Rasmus Seebach", "Natteravn"]);

			parser.splitTitle("Elle King - Ex's & Oh's")
			      .should
			      .eql(["Elle King", "Ex's & Oh's"]);

			parser.splitTitle("ItaloBrothers - Kings & queens")
			      .should
			      .eql(["ItaloBrothers", "Kings & queens"]);

			parser.splitTitle("Coldplay - Adventure of a lifetime")
			      .should
			      .eql(["Coldplay", "Adventure of a lifetime"]);

			parser.splitTitle("Rasmus Seebach - Uanset (Le Boeuf remix)")
			      .should
			      .eql(["Rasmus Seebach", "Uanset (Le Boeuf remix)"]);

			parser.splitTitle("Brandon Beal feat. Lukas Graham - Golden")
			      .should
			      .eql(["Brandon Beal feat. Lukas Graham", "Golden"]);

			parser.splitTitle("R. City feat. Adam Levine - Locked away")
			      .should
			      .eql(["R. City feat. Adam Levine", "Locked away"]);

			parser.splitTitle("Flo Rida feat. Robin Thicke & Verdine Wh - I don't like it, I love it")
			      .should
			      .eql(["Flo Rida feat. Robin Thicke & Verdine Wh", "I don't like it, I love it"]);

			parser.splitTitle("USO feat. Johnson - Supermayn i lommen (Fuck Boy remix)")
			      .should
			      .eql(["USO feat. Johnson", "Supermayn i lommen (Fuck Boy remix)"]);

			parser.splitTitle("Charlie Puth featuring Meghan Trainor - Marvin Gaye")
			      .should
			      .eql(["Charlie Puth featuring Meghan Trainor", "Marvin Gaye"]);
		});
	});

	describe("parseArtist", function ()
	{
		it("should return the input, when nothing matches", function ()
		{
			parser.parseArtist("The Weeknd")
			      .should
			      .eql({
				      "artist":    "The Weeknd",
				      "featuring": []
			      });
		});

		it("should split on featuring", function ()
		{
			parser.parseArtist("Brandon Beal feat. Lukas Graham")
			      .should
			      .eql({
				      'artist':    'Brandon Beal',
				      'featuring': ['Lukas Graham']
			      });

			parser.parseArtist("R. City feat. Adam Levine")
			      .should
			      .eql({
				      'artist':    'R. City',
				      'featuring': ['Adam Levine']
			      });

			parser.parseArtist("Flo Rida feat. Robin Thicke & Verdine Wh")
			      .should
			      .eql({
				      'artist':    'Flo Rida',
				      'featuring': ['Robin Thicke', 'Verdine Wh']
			      });

			parser.parseArtist("Flo Rida feat. Robin Thicke and Verdine Wh")
			      .should
			      .eql({
				      'artist':    'Flo Rida',
				      'featuring': ['Robin Thicke', 'Verdine Wh']
			      });

			parser.parseArtist("Charlie Puth featuring Meghan Trainor")
			      .should
			      .eql({
				      'artist':    'Charlie Puth',
				      'featuring': ['Meghan Trainor']
			      });

			parser.parseArtist("Calvin Harris + Disciples")
			      .should
			      .eql({
				      'artist':    'Calvin Harris',
				      'featuring': ['Disciples']
			      })
		});
	});

	describe("parseTitle", function ()
	{
		it("should return the input, when nothing matches", function() {
			parser.parseTitle("Ïn the night").should.eql({
				'title': "Ïn the night"
			});
		});
	});
});