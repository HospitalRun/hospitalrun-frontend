module("setup", {
  teardown: function(){
    fakehr.reset();
  }
});

test("replaces and restores the native xhr object", function() {
  var keep = window.XMLHttpRequest;

  fakehr.start();
  notEqual(window.XMLHttpRequest, keep);

  fakehr.stop();
  equal(window.XMLHttpRequest, keep)
});

test("stopping does not clear the intercepted requests", function(){
  fakehr.start();
  var created = new XMLHttpRequest();
  fakehr.stop();

  deepEqual(fakehr.requests, [created]);

  fakehr.start();
  var created2 = new XMLHttpRequest();
  fakehr.stop();

  deepEqual(fakehr.requests, [created, created2]);
});


test("clearing removes any existing intercepted requests", function(){
  fakehr.start();
  var created = new XMLHttpRequest();
  deepEqual(fakehr.requests, [created]);

  fakehr.clear();
  deepEqual(fakehr.requests, []);
});

test("resetting clears the intercepted requests", function(){
  fakehr.start();
  var created = new XMLHttpRequest();
  fakehr.reset();

  deepEqual(fakehr.requests, []);
});