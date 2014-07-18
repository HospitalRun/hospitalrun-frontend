///////////////////////////////////////////////////////////////////////////////
// Application
///////////////////////////////////////////////////////////////////////////////
App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend({
    needs: ['calendar']
});

App.ApplicationRoute = Ember.Route.extend({
    setupController: function () {
      this.controllerFor('calendar').update();
    }
});

App.ApplicationView = Ember.View.extend({
    templateName: 'application'
});


///////////////////////////////////////////////////////////////////////////////
// Controller
///////////////////////////////////////////////////////////////////////////////
App.CalendarController = Ember.Calendar.CalendarController.extend({
    content: []
  , update: function () {
      if (!this.get('week')) { return; }
      
      var self = this;
      $.getJSON('http://ember-calendar-ajax.herokuapp.com', { week: self.get('week').toDate() }, function (response) {
        if (!response) { return; }
        self.clear().pushObjects(response).notifyPropertyChange('content');
      });
    }.observes('week')
});