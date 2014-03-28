var xhr;
module("open", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
  },
  teardown: function(){
    xhr = undefined;
  }
});

test("open sets the method property", function(){
  xhr.open('get', '/some/url');
  equal(xhr.method, 'get');
});

test("open sets the url property", function(){
  xhr.open('get', '/some/url');
  equal(xhr.url, '/some/url');
});

test("open sets the async property", function(){
  xhr.open('get', '/some/url', false);
  equal(xhr.async, false);
});

test("open sets the async property to true if a boolean isn't passed", function(){
  xhr.open('get', '/some/url', 'whatisthisidontevent');
  equal(xhr.url, '/some/url', false);
});

test("open sets the username property", function(){
  xhr.open('get', '/some/url', true, 'johndoe');
  equal(xhr.username, 'johndoe');
});

test("open sets the password property", function(){
  xhr.open('get', '/some/url', true, 'johndoe', 'password');
  equal(xhr.password, 'password');
});

test("initializes the responseText as null", function(){
  xhr.open('get', '/some/url');
  equal(xhr.responseText, null);
});

test("initializes the responseXML as null", function(){
  xhr.open('get', '/some/url');
  equal(xhr.responseXML, null);
});

test("initializes the requestHeaders property as empty object", function(){
  xhr.open('get', '/some/url');
  deepEqual(xhr.requestHeaders, {});

});

test("open sets the ready state to 1", function(){
  xhr.open('get', '/some/url');
  equal(xhr.readyState, 1)
});

test("triggers the onreadystatechange event", function(){
  var wasCalled = false;

  xhr.onreadystatechange = function(){
    wasCalled = true;
  }

  xhr.open('get', '/some/url');

  ok(wasCalled);
});
