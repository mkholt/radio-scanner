/**
 * Created by morten on 06-03-16.
 */

"use strict";

var htmlparser = require('htmlparser2');

function parseHtml(html, callback)
{
	var retArr = [];
	var state = {
		'inDiv':  false,
		'inSpan': false,
		'time':   "",
		'song':   ""
	};

	if (!html)
	{
		callback(retArr);
		return;
	}

	var parser = new htmlparser.Parser({
		'onopentag': function (name, attrs)
		             {
			             if (name == 'div' && attrs.style && attrs.style == 'margin-bottom: 2px;')
			             {
				             state.inDiv = true;
			             }
			             else if (name == 'span' && state.inDiv)
			             {
				             state.inSpan = true;
			             }
		             },

		'ontext': function (text)
		          {
			          if (state.inDiv)
			          {
				          if (state.inSpan)
				          {
					          state.time = text;
				          }
				          else
				          {
					          state.song += text;
				          }
			          }
		          },

		'onclosetag': function (name)
		              {
			              if (name == 'div' && state.inDiv)
			              {
				              state.inDiv = false;

				              var song = splitTitle(state.song);

				              retArr.push({
					              'time':   state.time,
					              'song':   state.song,
					              'artist': parseArtist(song[0]),
					              'title':  parseTitle(song[1])
				              });

				              state.song = "";
				              state.time = "";
			              }
			              else if (name == 'span' && state.inSpan)
			              {
				              state.inSpan = false;
			              }
		              }
	}, {
		'decodeEntities': true
	});

	parser.write(html);
	parser.end();

	callback(retArr);
}

function splitTitle(title)
{
	var split = title.split(" - ");
	if (split.length > 1)
	{
		return [
			split.shift(),
			split.join(' - ')
		];
	}

	split = title.split("-");
	return [
		split.shift(),
		split.join('-')
	];
}

function parseArtist(artist)
{
	var split = artist.split(/ ?feat(uring)?\.? ?| ?\+ ?/);
	var featuring;

	artist = split.shift();

	if (split.length)
	{
		split.shift(); // Remove the group
		featuring = split.map((part) => part.split(/ ?& ?| ?and ?/));                   // Split each featuring artist by "and"
		featuring = featuring.reduce((previous, current) => previous.concat(current));  // Flatten the resulting array of arrays, so we just get a list
	}

	return {
		"artist":    artist,
		"featuring": featuring || []
	};
}

function parseTitle(title)
{
	return {
		'title': title
	};
}

module.exports.parseHtml = parseHtml;
module.exports.splitTitle = splitTitle;
module.exports.parseArtist = parseArtist;
module.exports.parseTitle = parseTitle;