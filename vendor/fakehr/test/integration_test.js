module("jQuery ajax", {
  setup: function(){
    fakehr.start();
  },
  teardown: function(){
    fakehr.reset();
  }
});

test("jQuery success", function() {
  var wasCalled = false;
  var bodyPassed = false;

  $.ajax({
    mehthod: 'get',
    url: '/some/url',
    success: function(resp){
      wasCalled = true;
      bodyPassed = resp.bodyPassed;
    }
  });

  fakehr.match('get', '/some/url').respond(200, {"Content-Type":"applicatio/json"}, '{"bodyPassed":true}');

  ok(wasCalled);
  ok(bodyPassed);
});

test("jQuery failure", function() {
  var wasCalled = false;
  var bodyPassed = false;

  $.ajax({
    mehthod: 'get',
    url: '/some/url',
    error: function(xhr, errorType, statusText){
      wasCalled = true;
      equal(errorType, "error");
      equal(statusText, "Not Found");
      bodyPassed = JSON.parse(xhr.responseText).bodyPassed;
    }
  });

  fakehr.match('get', '/some/url').respond(404, {"Content-Type":"applicatio/json"}, '{"bodyPassed":true}');

  ok(wasCalled);
  ok(bodyPassed);
});
