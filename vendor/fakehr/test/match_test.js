module("match", {
  setup: function(){
    fakehr.start();
  },
  teardown: function(){
    fakehr.reset();
  }
});

test("matches open requests by HTTP method and url", function(){
  var xhr = new XMLHttpRequest();
  xhr.open('get', '/a/path');

  equal(fakehr.match('get', '/a/path'), xhr);
});

test("matches any requests by HTTP method, url, and readyState", function(){
  var xhr = new XMLHttpRequest();
  xhr.open('get', '/a/path');
  xhr.respond(200, {}, "OK");

  equal(fakehr.match('get', '/a/path', 4), xhr);
});

test("only returns first object found", function(){
  var xhr = new XMLHttpRequest();
  xhr.open('get', '/a/path');

  var xhr2 = new XMLHttpRequest();
  xhr2.open('get', '/another/path');

  equal(fakehr.match('get', '/a/path'), xhr);
});

test("2 post requests with the same url, yet different body", function() {
  var xhr = new XMLHttpRequest();
  xhr.open('post', '/a/path', true);
  xhr.send('First POST');

  var xhr2 = new XMLHttpRequest();
  xhr2.open('post', '/a/path', true);
  xhr2.send('Second POST');
  equal(fakehr.match('post', '/a/path', 1, 'First POST'), xhr);
  equal(fakehr.match('post', '/a/path', 1, 'Second POST'), xhr2);
});