#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2))
var color = require('term-color')

var findBroken = require('../')

var cwd = argv._[0] || process.cwd()
findBroken(cwd, argv, function (result) {
  result.errors.forEach(function (err) {
    console.error(color.red('ERROR'), err.message)
  })
  
  var brokenFiles = Object.keys(result.broken)
  console.log("Broken files:", color.bold(brokenFiles.length))
  
  brokenFiles.forEach(function (key) {
    console.log(color.bold(key))
    var brokenRequires = result.broken[key]    
    brokenRequires.forEach(function (req) {
      console.log('  ' + color.yellow(req.module))
    })
  })
})