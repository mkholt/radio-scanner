/**
 * Created by morten on 19-02-16.
 */

var fs = require('fs');

module.exports.settings = {
    'cacheDir': '~/.radio-cache',
    'cacheDirMode': 0x750
};

module.exports.setup = function()
{
    var cacheDir = module.exports.settings.cacheDir;
    var cacheDirMode = module.exports.settings.cacheDirMode;

    fs.lstat(cacheDir, function(err, stats) {
        if (err) {
            fs.mkdirSync(cacheDir, cacheDirMode);
        } else if (!stats.isDirectory()) {
            throw new Error(cacheDir + " is not a directory");
        }
    });
};