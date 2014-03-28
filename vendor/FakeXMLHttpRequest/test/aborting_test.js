var xhr;
module("aborting", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
  },
  teardown: function(){
    window.xhr = undefined;
  }
});

test("sets aborted to true", function(){
  xhr.abort();
  equal(xhr.aborted, true);
});

test("sets responseText to null", function(){
  xhr.abort();
  equal(xhr.responseText, null);
});

test("sets errorFlag to true", function(){
  xhr.abort();
  equal(xhr.errorFlag, true);
});

test("sets requestHeaders to {}", function(){
  xhr.abort();
  deepEqual(xhr.requestHeaders, {});
});

test("sets readyState to 0", function(){
  xhr.abort();
  equal(xhr.readyState, 0);
});

test("calls the abort event", function(){
  var wasCalled = false;
  xhr.addEventListener('abort', function(){
    wasCalled = true;
  });

  xhr.abort();

  ok(wasCalled);
});

test("calls the onerror event", function(){
  var wasCalled = false;
  xhr.onerror = function(){
    wasCalled = true;
  };

  xhr.abort();

  ok(wasCalled);
});
