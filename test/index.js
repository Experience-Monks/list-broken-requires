var brokenRequires = require('../')
var test = require('tape')
var path = require('path')

test('lists broken relative require statements in a source directory', function (t) {
  t.plan(3)
  var dir = path.resolve(__dirname, 'fixtures')
  brokenRequires(dir, function (results) {
    t.deepEqual(results.errors, [], 'no errors')
    t.deepEqual(results.modules, [ 'url',
      './module.js',
      'url',
      'http',
      './not-existing.js',
      'util',
      '../not-a-file.js',
      '../index.js'
    ], 'no errors')

    var keys = Object.keys(results.broken)
    var brokenA = path.resolve(dir, 'es6-and-cjs.js')
    var brokenB = path.resolve(dir, 'es6.js')
    t.deepEqual(keys, [ brokenA, brokenB ])

    var modules = results.broken[brokenA].map(function (x) {
      return x.module
    })
    t.deepEqual(modules, [ './not-existing.js' ])

    modules = results.broken[brokenB].map(function (x) {
      return x.module
    })
    t.deepEqual(modules, [ '../not-a-file.js' ])
  })
})
