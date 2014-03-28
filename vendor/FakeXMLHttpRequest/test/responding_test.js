var xhr;
module("responding", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
  },
  teardown: function(){
    xhr = undefined;
  }
});

test("defaults responseHeaders to {} if not passed", function(){
  xhr.respond(200);
  deepEqual(xhr.responseHeaders, {});
});

test("sets responseHeaders", function(){
  xhr.respond(200, {"Content-Type":"application/json"});
  deepEqual(xhr.responseHeaders, {"Content-Type":"application/json"});
});

test("sets body", function(){
  xhr.respond(200, {"Content-Type":"application/json"}, JSON.stringify({a: 'key'}));
  equal(xhr.responseText, '{"a":"key"}');
});

test("parses the body if it's XML and no content-type is set", function(){
  xhr.respond(200, {}, "<key>value</key>");
  equal(xhr.responseXML.constructor, Document);
});

test("parses the body if it's XML and xml content type is set", function(){
  xhr.respond(200, {'Content-Type':'application/xml'}, "<key>value</key>");
  equal(xhr.responseXML.constructor, Document);
});

test("does not parse the body if it's XML and another content type is set", function(){
  xhr.respond(200, {'Content-Type':'application/json'}, "<key>value</key>");
  equal(xhr.responseXML, undefined);
});

test("calls the onload callback", function(){
  var wasCalled = false;

  xhr.onload = function(ev){
    wasCalled = true;
  };

  xhr.respond(200, {}, "");

  ok(wasCalled);
});
