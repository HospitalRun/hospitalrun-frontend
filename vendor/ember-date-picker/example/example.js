var App = Ember.Application.create({
    rootElement: '#demo',
    debugMode: true
});

App.ApplicationController = Ember.ObjectController.extend({
	date1: '3/4/2012',
	date2: 'December 18th, 2008',

	actions: {
		dateUpdated: function(date) {
			console.log('date updated to ' + date);
		}
	}
});