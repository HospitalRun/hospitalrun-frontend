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
// Controller
///////////////////////////////////////////////////////////////////////////////
App.CalendarController = Ember.Calendar.CalendarController.extend({
    states: ['day', 'week']
  , initialState: 'day'
  , content: function () {
      var events = [];
      var date;
      var time;
      var duration;
      var i;
      
      for (i = 0; i < 3; i++) {
        time = 1000 * 60 * 60 * 8 + 1000 * 60 * 30 * Math.floor(Math.random() * 24);
        duration = 1000 * 60 * 30 * (1 + Math.floor(Math.random() * 5));
        
        events.push({
            name: 'Event ' + events.length
          , start: moment().startOf('day').add('milliseconds', time)
          , end: moment().startOf('day').add('milliseconds', time + duration)
        });
      }
      
      for (i = 0; i < 45; i++) {
        date = Math.floor(Math.random() * 21) - 7;
        time = 1000 * 60 * 60 * 8 + 1000 * 60 * 30 * Math.floor(Math.random() * 24);
        duration = 1000 * 60 * 30 * (1 + Math.floor(Math.random() * 5));
        
        events.push({
            name: 'Event ' + events.length
          , start: moment().startOf('day').add('days', date - moment().day()).add('milliseconds', time)
          , end: moment().startOf('day').add('days', date - moment().day()).add('milliseconds', time + duration)
        });
      }
      
      return events;
    }.property()
});