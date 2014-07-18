///////////////////////////////////////////////////////////////////////////////
// Application
///////////////////////////////////////////////////////////////////////////////
App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend({
    needs: ['calendar']
});

App.ApplicationView = Ember.View.extend({
    templateName: 'application'
});


///////////////////////////////////////////////////////////////////////////////
// Views
///////////////////////////////////////////////////////////////////////////////
App.EventView = Ember.Calendar.EventView.extend({
    templateName: function () {
      return this.get('event.template') || 'ember-calendar-event';
    }.property('event.template')
    
  , classNameBindings: ['facebook', 'google', 'spoton']
  , spoton: function () {
      return this.get('event.type') === 0;
    }.property('event.type')
  , google: function () {
      return this.get('event.type') === 1;
    }.property('event.type')
  , facebook: function () {
      return this.get('event.type') === 2;
    }.property('event.type')
});


///////////////////////////////////////////////////////////////////////////////
// Controller
///////////////////////////////////////////////////////////////////////////////
App.CalendarController = Ember.Calendar.CalendarController.extend({
    content: function () {
      var events = [];
      var date;
      var time;
      var duration;
      var event;
      
      for (var i = 0; i < 15; i++) {
        date = Math.floor(Math.random() * 7);
        time = 1000 * 60 * 60 * 8 + 1000 * 60 * 30 * Math.floor(Math.random() * 24);
        duration = 1000 * 60 * 30 * (1 + Math.floor(Math.random() * 5));
        
        event = {
            name: 'Event ' + events.length
          , start: moment().startOf('day').add('days', date - moment().day()).add('milliseconds', time)
          , end: moment().startOf('day').add('days', date - moment().day()).add('milliseconds', time + duration)
          , type: Math.floor(Math.random() * 3) // 0 = spoton, 1 = google, 2 = facebook
        };
        
        // add unique properties for spoton type
        if (event.type === 0) {
          event.numGoing = Math.floor(Math.random() * 100);
          event.template = 'ember-calendar-event-spoton';
        }
        
        events.push(event);
      }
      
      return events;
    }.property()
    
  , eventViewClass: 'App.EventView'
});