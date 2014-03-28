var App;

module('Acceptances - Component', {
  setup: function(){
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('component output is rendered', function(){
  expect(2);

  visit('/component-test').then(function(){
    var list = find('.pretty-color');
    equal(list.length, 3);
    equal(list.first().text(), 'Pretty Color: purple\n');
  });
});

