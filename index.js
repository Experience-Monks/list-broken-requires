var walk = require('walk')
var fs = require('fs')
var path = require('path')
var noop = function () {}
var isRelative = require('relative-require-regex')()
var detect = require('detect-import-require')
var mapLimit = require('map-limit')
var resolve = require('resolve')

module.exports = listBrokenRequires
function listBrokenRequires (cwd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  opt = opt || {}
  cb = cb || noop

  var accept = opt.accept || /\.js$/i
  var result = {
    errors: [],
    modules: [],
    broken: {}
  }

  start()

  function read (file, next) {
    // skip non-accepted file types
    if (!accept.test(file)) return next()
    // find all imports/requires
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        result.errors.push(err)
        return next()
      }
      var found = detect.find(data, opt)
      testModules(file, found, next)
    })
  }

  function testModules (file, detected, next) {
    var strings = detected.strings
    var dir = path.dirname(file)

    // append to our final results list
    result.modules = result.modules.concat(strings)

    var relativeImports = strings.filter(function (module) {
      return isRelative.test(module)
    })

    mapLimit(relativeImports, 25, function (item, done) {
      resolve(item, { basedir: dir }, function (err, res) {
        if (err) {
          if (!(file in result.broken)) {
            result.broken[file] = []
          }

          result.broken[file].push({
            module: item,
            error: err
          })
        }
        done(null)
      })
    }, next)
  }

  function start () {
    var walker = walk.walk(cwd, opt)
    walker.on('file', function (dir, stat, next) {
      var file = path.resolve(dir, stat.name)
      read(file, next)
    })

    walker.on('errors', function (root, stats, next) {
      var newErrors = []
      if (Array.isArray(stats)) {
        newErrors = stats.map(function (stat) {
          return stat.error
        }).filter(Boolean)
      } else if (stats && stats.error) {
        newErrors = [ stats.error ]
      }
      result.errors = result.errors.concat(newErrors)
      next()
    })

    walker.on('end', function () {
      cb(result)
    })
  }
}
