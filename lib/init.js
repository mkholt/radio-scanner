/**
 * Created by morten on 19-02-16.
 */

"use strict";

var fs = require('fs');

module.exports.settings = {
	'cacheDir':     '.cache',
	'cacheDirMode': 0x750,
	'baseUrl':      'http://radioabc.dk/playlist/index.php'
};

module.exports.setup = function ()
{
	var cacheDir = module.exports.settings.cacheDir;
	var cacheDirMode = module.exports.settings.cacheDirMode;

	fs.mkdir(cacheDir, cacheDirMode, function (err)
	{
		if (err && err.code != 'EEXIST')
		{
			throw new Error('Could not create directory: ' + cacheDir + ', ERROR=' + err.code);
		}
	});
};