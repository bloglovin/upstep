var assert = require('assert');
var Equip  = require('../');

describe('Equip', function () {
  it('correctly runs install script', function (done) {
    Equip(null, {
      updatesDir: __dirname + '/mock'
    }, function (err, updates) {
      assert(!err);
      assert.equal(updates, 'install');
      done();
    });
  });

  it('correctly runs all updates', function (done) {
    Equip('0.0.0', {
      updatesDir: __dirname + '/mock'
    }, function (err, updates) {
      assert(!err);
      assert.equal(updates[0], '0.0.5');
      assert.equal(updates[1], '1.0.0');
      done();
    });
  });

  it('correctly throws on missing updates dir', function () {
    assert.throws(function () {
      Equip('0.0.0');
    }, /missing path to updates/);
  });

  it('correctly returns an error if update dir is missing', function (done) {
    Equip('0.0.0', {
      updatesDir: 'foobar'
    }, function (err, updates) {
      assert(err);
      done();
    });
  });

  it('correctly forwards errors updates', function (done) {
    Equip('0.0.0', {
      updatesDir: __dirname + '/errorer'
    }, function (err, updates) {
      assert(err);
      assert.equal(updates[0], '0.0.5');
      done();
    });
  });
});

