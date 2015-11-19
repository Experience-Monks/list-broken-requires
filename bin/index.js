#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2))
var color = require('term-color')
var path = require('path')
var escapeStr = require('jsesc')
var fs = require('fs')

var findBroken = require('../')

var cwd = process.cwd()
var dir = argv._[0] || cwd

var stat = fs.statSync(dir)
if (!stat.isDirectory()) {
  throw new Error('Must specify a directory as first argument')
}

findBroken(dir, argv, function (result) {
  result.errors.forEach(function (err) {
    console.error(color.red('ERROR'), err.message)
  })

  var sum = 0
  var brokenFiles = Object.keys(result.broken)
  brokenFiles.forEach(function (key) {
    console.log(color.bold(path.relative(cwd, key)))
    var brokenRequires = result.broken[key]
    brokenRequires.forEach(function (req) {
      sum++
      var mod = "'" + escapeStr(req.module) + "'"
      console.log('  ' + color.yellow(mod))
    })
  })

  if (sum > 0) console.log()
  console.log('Broken requires:', color.bold(sum))
})
