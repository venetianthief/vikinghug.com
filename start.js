#!/usr/bin/env node

// Environment Variables!
var dotenv = require('dotenv');
dotenv.load()

var util  = require("util"),
    path  = require('path'),
    spawn = require('win-spawn');

var basedir = path.join(__dirname, "node_modules", ".bin");
var commandArray = [];

var die = function(cmd) {
  i = commandArray.indexOf(cmd);
  commandArray.splice(i, 1);

  for (var i = 0; i < commandArray.length; i++) {
    commandArray[i].kill();
  }
}

var runCommand = function(command, args) {
  var cmd = spawn(path.join(basedir, command), args);
  commandArray.push(cmd);

  cmd.stdout.setEncoding('utf8');
  cmd.stdout.on('data', function(data) {
    util.print(data);
  });
  cmd.stderr.setEncoding('utf8');
  cmd.stderr.on('data', function(data) {
    util.print(data);
  });

  cmd.on('close', function(code) {
    util.print('Child process exited with code: ', code, "\n");
    die(cmd);
  });
}

console.log(">> NODE_ENV: " + process.env.NODE_ENV);

runCommand("coffee", ['app.coffee']);
if (process.env.NODE_ENV == "development") {
  runCommand("gulp", ['watch']);
}

