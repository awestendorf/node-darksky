Node.js DarkSky API wrapper
===========================

[![Build Status](http://travis-ci.org/awestendorf/node-darksky.png)](http://travis-ci.org/awestendorf/node-darksky)

About
-----

A Node.js module for integrating with the [Dark Sky](http://darkskyapp.com) API. You must acquire an API key to use it.

Installation
------------

The project is hosted on npm

  npm install darksky

Usage
-----

Create a client and then call one of the exposed methods

  var darksky = require("darksky");
  var client = darksky.Client("mykey");
  
  client.forecast('37.8267','-122.423', console.log, console.error);

