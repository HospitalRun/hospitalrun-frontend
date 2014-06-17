App = Ember.Application.create();
App.setupForTesting();
App.injectTestHelpers();
App.rootElement = '#ember-testing';

App.ApplicationController = Ember.ObjectController.extend({
	spinBoxContent: ['apple', 'orange', 'banana', 'pear', 'pineapple', 'peach', 'plum', 'grape', 'mango', 'apricot'],
	spinBoxRange: [1, 100],
	spinBoxValue: null
});