var xhr;
module("FakeXMLHttpRequest construction", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
  },
  teardown: function(){
    xhr = undefined;
  }
});

test("readyState is 0", function(){
  equal(xhr.readyState, 0);
});

test("requestHeaders are {}", function(){
  deepEqual(xhr.requestHeaders, {});
});

test("requestBody is null", function(){
  equal(xhr.requestBody, null);
});

test("status is 0", function(){
  equal(xhr.status, 0);
});

test("statusText is empty", function(){
  equal(xhr.status, '');
});
