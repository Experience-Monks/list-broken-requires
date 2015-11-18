var brokenRequires = require('../')
var test = require('tape')
var path = require('path')

test('lists broken require statements in a directory', function (t) {
  brokenRequires(path.resolve(__dirname, 'fixtures'), function (results) {
    console.log(results)
  })
  t.end()
})
