//
// # Upstep
//

/* jshint node: true */
'use strict';

var pathjoin = require('path').join;
var basename = require('path').basename;
var fs       = require('fs');
var semver   = require('semver');
var assert   = require('assert');

var Upstep = module.exports = function Upstep(currver, opts, done) {
  assert(opts && opts.updatesDir, 'missing path to updates');

  if (!currver) {
    var func = require(pathjoin(opts.updatesDir, 'install'));
    func(opts, function (err) {
      done(err, 'install');
    });
  }
  else {
    fs.readdir(opts.updatesDir, function (err, files) {
      if (err) return done(err, null);

      // Turn files into version names and filter old versions.
      var versions = files.map(function (item) {
        return basename(item, '.js');
      }).filter(function (item) {
        return (item !== 'install') && semver.gt(item, currver);
      });
      versions.sort(Upstep.sortVersions);

      var didRun = [];
      function runUpdate(version) {
        if (!version) return done(null, didRun);

        var func = require(pathjoin(opts.updatesDir, version));
        didRun.push(version);
        func(opts, function (err) {
          if (err) return done(err, didRun);
          else runUpdate(versions.shift());
        });
      }

      runUpdate(versions.shift());
    });
  }
};

Upstep.sortVersions = function equipSort(a, b) {
  a = basename(a, '.js');
  b = basename(b, '.js');
  return semver.compare(a, b);
};

