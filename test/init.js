/**
 * Created by morten on 11-02-16.
 */

var should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    init = require('../init')
;
require('should-sinon');

describe('init', function() {
    describe("setup", function() {
        "use strict";

        afterEach(function() {
            fs.lstat.restore();
            fs.mkdirSync.restore();
        });

        it('should create the cache directory when it does not exist', function () {
            sinon.stub(fs, 'lstat').callsArgWith(1, true);
            sinon.stub(fs, 'mkdirSync').returns(undefined);

            init.setup();
            fs.lstat.should.be.calledWith(init.settings.cacheDir);
            fs.mkdirSync.should.be.calledWith(init.settings.cacheDir, init.settings.cacheDirMode);
        });

        it('should pass if the directory exists', function() {
            sinon.stub(fs, 'lstat').callsArgWith(1, false, {
                'isDirectory': () => true
            });
            sinon.stub(fs, 'mkdirSync').throws();

            init.setup();
            fs.mkdirSync.should.not.be.called();
        });

        it('should throw error if not a directory', function() {
            sinon.stub(fs ,'lstat').callsArgWith(1, false, {
                'isDirectory': () => false
            });
            sinon.stub(fs, 'mkdirSync').throws();

            init.setup.should.throw(init.settings.cacheDir + ' is not a directory');
        })
    });
});

