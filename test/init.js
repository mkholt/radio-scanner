/**
 * Created by morten on 11-02-16.
 */

var should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    init = require('../lib/init')
;
require('should-sinon');

describe('init', function() {
    describe("setup", function() {
        "use strict";

        afterEach(function() {
            fs.mkdir.restore();
        });

        it('should create the cache directory when it does not exist', function () {
            sinon.stub(fs, 'mkdir').callsArgWith(2, undefined);

            init.setup();
            fs.mkdir.should.be.calledWith(init.settings.cacheDir, init.settings.cacheDirMode);
        });

        it('should pass if the directory exists', function() {
            sinon.stub(fs, 'mkdir').callsArgWith(2, { 'code': 'EEXIST' });

            init.setup();
            fs.mkdir.should.calledWith(init.settings.cacheDir, init.settings.cacheDirMode);
        });

        it('should throw error otherwise', function() {
            sinon.stub(fs, 'mkdir').callsArgWith(2, { 'code': 'EERROR' });

            init.setup.should.throw('Could not create directory: ' + init.settings.cacheDir + ", ERROR=EERROR");
        })
    });
});

