# fakehr [![Build Status](https://travis-ci.org/trek/fakehr.png)](https://travis-ci.org/trek/fakehr)

fakehr is a tiny (~50loc) library for intercepting ajax requests in the browser for testing purposes.
It is application and test library agnostic. fakehr depends on [FakeXMLHttpRequest](https://github.com/trek/FakeXMLHttpRequest).

## Using
fakehr has a minimal public interface:

###`fakehr.start()`
Momentarily replaces the native `XMLHttpRequest` object with a fake one that registers itself with fakehr when new requests are attempted. These requests will not make HTTP requests. Instead a response is triggered by the developer. These requests objects are provided by [FakeXMLHttpRequest](https://github.com/trek/FakeXMLHttpRequest).

###`fakehr.stop()`
Stops intercepting requests and restores the native `XMLHttpRequest` object.

###`fakehr.requests`
An array of intercepted requests.

###`fakehr.clear()`
Clears the array of intercepted requests. If `response` wasn't triggered on these requests, they will never complete.

###`fakehr.reset()`
Clears the intercepted requests and restores the native `XMLHttpRequest` object.

###`fakehr.match(httpMethod, url, [readyState])`
Searches the intercepted requests for the first open (`readyState` of `1`) request whose
HTTP method and url match the passed arguments. Optionally you can provide a
numeric [`readyState` code value](http://www.w3.org/TR/XMLHttpRequest/#states) to search for
requests in that state.

## Why not Sinon.JS or something else?
Sinon.JS includes much more than just request mocking. I wanted a single purpose library. Most other
HTTP mocking libraries take the approach of acting like a fake server where requests registered before a test runs and canned responses are triggered immediately when they occur. This makes it cumbersome to do things like

  * specify multiple responses to the similar requests in a specific order
  * control where in the flow of execution a response occurs (for testing behavior like loading screens)
  * control the response order and timing of multiple simultaneous requests
  * testing the effect of requests that fail entirely and are aborted by the browser

## Test library integration
fakehr doesn't integrate with any specific testing framework, so does not include features like
  
  * failing a test if there are unhandled requests
  * failing a test if a request is made to an unknown url
  * framework-specific helpers or matchers
  * automatically starting before tests run
  * automatically resetting when tests complete

Instead, you should implement these features yourself. A very simple QUnit example:

```javascript
module("testing something that makes requests", {
  setup: function(){
    fakehr.start();
  },
  teardown: function(){
    var requests = fakehr.requests;
    var request;

    for(var i = 0; i < requests.length; i++){
      request = requests[i];
      if(request.readyState !== 4) {
        fakehr.reset();
        throw("A "+ request.method +" request to "+ request.url +" was left unhandled!");
      }
    }

    fakehr.reset();
  }
});
```

## Testing
Tests are written in [QUnit](http://qunitjs.com/) and run through the [Karma test runner](http://karma-runner.github.io/0.10/index.html). 

Run with:

```
karma start
```

## Todo

  * Replace and Restore ActiveX-based requests for IE
