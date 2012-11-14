//
// Contains the implementation of the Dark Sky Client
//
// Copyright (c) 2012 Aaron Westendorf. See LICENSE for further details.
//
var https = require('https');

function Client(api_key)
{
  // Creates a new Dark Sky client with a given API key
  //
  // The key can be acquired by contacting Dark Sky http://darkskyapp.com/
  //
  // @constructor
  // @param {String} api_key The API key
  this.api_key = api_key;
}

Client.prototype.call = function(options, callback)
{
  // Support function to run an HTTPS query against the API
  //
  // @param {Object) options The options to pass to https.request
  // @param {Function} [callback] The optional callback for the result data
  // @param {Function} [error] The optional callback for error results
  
  var req = https.request(options, function(res) {
    // console.log("status: ", res.statusCode);
    // console.log("headers: ", res.headers);
    if( callback ) {
      res.on('data', function(d) {
        callback(null, d);
      });
    }
  });
  
  if( callback ) {
    req.on('error', function(e) {
      callback(e);
    });
  }

  req.end();
};

Client.prototype.forecast = function(latitude, longitude, callback)
{
  // Fetch the forecast for a given latitutde and longitude in decimal
  // degrees
  // http://darkskyapp.com/api/forecast.html
  //
  // @param {String|Number} latitude The latitude of the forecast position
  // @param {String|Number} longitude The longitude of the forecast position
  // @param {Function} [callback] The optional callback function to process the result
  // @param {Function} [error] The optional callback function to process errors

  var options = {
    host: 'api.darkskyapp.com',
    port: 443,
    path : '/v1/forecast/'+this.api_key+'/'+latitude+','+longitude ,
    method : 'GET'
  };

  this.call(options, callback);
};

Client.prototype.brief_forecast = function(latitude, longitude, callback)
{
  // Fetch the brief forecast for a given latitutde and longitude in decimal
  // degrees
  // http://darkskyapp.com/api/forecast.html
  //
  // @param {String|Number} latitude The latitude of the forecast position
  // @param {String|Number} longitude The longitude of the forecast position
  // @param {Function} [callback] The optional callback function to process the result
  // @param {Function} [error] The optional callback function to process errors

  var options = {
    host: 'api.darkskyapp.com',
    port: 443,
    path : '/v1/brief_forecast/'+this.api_key+'/'+latitude+','+longitude ,
    method : 'GET'
  };

  this.call(options, callback);
};

Client.prototype.precipitation = function(points, callback)
{
  // Fetch forecasts for multiple points and times. Points should be an
  // array containing triplets of [latitude, longitute, time], where
  // latitude and longitude are in decimal degrees, and time is a UNIX
  // GMT timestamp
  // http://darkskyapp.com/api/precipitation.html
  //
  // @param {Array[]} - a list of [LAT,LON,TIME] to look up the forecast for
  // @param {Function} [callback] The optional callback function to process the result
  // @param {Function} [error] The optional callback function to process errors

  points = points.map(function(point) {
    return point.join(',');
  });

  var options = {
    host: 'api.darkskyapp.com',
    port: 443,
    path : '/v1/precipitation/'+this.api_key+'/'+points.join(';') ,
    method : 'GET'
  };

  this.call(options, callback);
};

Client.prototype.interesting = function(callback)
{
  // Fetch forecasts for interesting storms happening right now
  // http://darkskyapp.com/api/interesting.html
  //
  // @param {Function} [callback] The optional callback function to process the result
  // @param {Function} [error] The optional callback function to process errors

  var options = {
    host: 'api.darkskyapp.com',
    port: 443,
    path : '/v1/interesting/'+this.api_key ,
    method : 'GET'
  };

  this.call(options, callback);
};

exports.Client = Client;
