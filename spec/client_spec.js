//
// Test the Dark Sky Client class
//
// Copyright (c) 2012 Aaron Westendorf. See LICENSE for further details.
//

var Client = require('../lib/client').Client;
var https = require('https');

describe("Client", function() {

var client;

beforeEach(function() {
  client = new Client('api_key');
});

it("should create a client with api key set", function() {
  expect(client.api_key).toEqual('api_key');
});

it("should call https request and all optional callbacks", function() {
  var callback = jasmine.createSpy();
  var request = {
    on : jasmine.createSpy(),
    end : jasmine.createSpy()
  };
  spyOn( callback, "call" );
  var request_spy = spyOn( https, "request");
  request_spy.andReturn( request );

  client.call("options", callback);
  // TODO: jasmine should support this style of call!
  // expect( https.request ).toHaveBeenCalledWith(["options", Function]);
  
  // Assert all the calls that would have happened
  expect( request_spy.argsForCall[0][0] ).toEqual("options");
  expect( request.end ).toHaveBeenCalled();
  
  // Call the request callback to assert that it registers for data
  var result = {
    on : jasmine.createSpy()
  };
  request_spy.argsForCall[0][1](result);
  expect( result.on.argsForCall[0][0] ).toEqual("data");
  
  // Call the data callback to assert that it calls our callback
  result.on.argsForCall[0][1]("data");
  expect( callback ).toHaveBeenCalledWith(null, "data");
});

it("should call https request without optional callbacks", function() {
  var callback = jasmine.createSpy();
  var request = {
    on : jasmine.createSpy(),
    end : jasmine.createSpy()
  };
  var request_spy = spyOn( https, "request");
  request_spy.andReturn( request );

  client.call("options");
  // TODO: jasmine should support this style of call!
  // expect( https.request ).toHaveBeenCalledWith("options", Function);
  
  // Assert all the calls that would have happened
  expect( request_spy.argsForCall[0][0] ).toEqual("options");
  expect( request.on ).not.toHaveBeenCalled();
  expect( request.end ).toHaveBeenCalled();
  
  // Call the request callback to assert that it doesnt register for data
  var result = {
    on : jasmine.createSpy()
  };
  request_spy.argsForCall[0][1](result);
  expect( result.on ).not.toHaveBeenCalled();

  // Call the error callback to assert that it doesnt call our callback
  expect( request.on ).not.toHaveBeenCalled();
});

it("should fetch the forecast", function()
{
  var call = spyOn( client, "call" );
  client.forecast("3.14", "1.42", "callback");
  
  expect( call ).toHaveBeenCalledWith(
    {
      host : "api.darkskyapp.com",
      port : 443,
      path : "/v1/forecast/api_key/3.14,1.42",
      method : 'GET'
    }, "callback"
  );
});

it("should fetch the brief forecast", function()
{
  var call = spyOn( client, "call" );
  client.brief_forecast("3.14", "1.42", "callback");
  
  expect( call ).toHaveBeenCalledWith(
    {
      host : "api.darkskyapp.com",
      port : 443,
      path : "/v1/brief_forecast/api_key/3.14,1.42",
      method : 'GET'
    }, "callback"
  );
});

it("should fetch the precipitation for a single location", function()
{
  var call = spyOn( client, "call" );
  client.precipitation([["3.14", "1.42", "now"]], "callback", "error");
  
  expect( call ).toHaveBeenCalledWith(
    {
      host : "api.darkskyapp.com",
      port : 443,
      path : "/v1/precipitation/api_key/3.14,1.42,now",
      method : 'GET'
    }, "callback"
  );
});

it("should fetch the precipitation for multiple locations", function()
{
  var call = spyOn( client, "call" );
  client.precipitation([["3.14", "1.42", "now"], ["4.23", "-7.58", "soon"]], "callback", "error");
  
  expect( call ).toHaveBeenCalledWith(
    {
      host : "api.darkskyapp.com",
      port : 443,
      path : "/v1/precipitation/api_key/3.14,1.42,now;4.23,-7.58,soon",
      method : 'GET'
    }, "callback"
  );
});

it("should fetch interesting weather", function()
{
  var call = spyOn( client, "call" );
  client.interesting("callback", "error");
  
  expect( call ).toHaveBeenCalledWith(
    {
      host : "api.darkskyapp.com",
      port : 443,
      path : "/v1/interesting/api_key",
      method : 'GET'
    }, "callback"
  );
});

});
