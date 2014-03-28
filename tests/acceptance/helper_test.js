var App;

module("Acceptances - Helper", {
  setup: function(){
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test("helper output is rendered", function(){
  expect(1);

  visit('/helper-test').then(function(){
    ok(exists("h3:contains('My name is Ember.')"));
  });
});

