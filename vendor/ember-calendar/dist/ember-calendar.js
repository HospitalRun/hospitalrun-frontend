/* ember-calendar 1.0.0 (https://github.com/joinspoton/ember-calendar) | (c) 2013 SpotOn (https://spoton.it) | http://www.opensource.org/licenses/MIT */
Ember.TEMPLATES["ember-calendar"] = Ember.Handlebars.compile("\n  {{view Ember.Calendar.ButtonsView controllerBinding='controller'}}\n  {{view Ember.Calendar.ContainerView controllerBinding='controller'}}\n");
Ember.TEMPLATES["ember-calendar-day"] = Ember.Handlebars.compile("\n\n\n  <div class='ember-calendar-head'>\n    <div class='ember-calendar-head-previous'><button {{action loadPrevious target='controller'}}>&laquo;</button></div>\n    <div class='ember-calendar-head-dates'>\n      {{view Ember.Calendar.HeadingDateView dateBinding='controller.date'}}\n    </div>\n    <div class='ember-calendar-head-next'><button {{action loadNext target='controller'}}>&raquo;</button></div>\n  </div>\n  <div class='ember-calendar-container'>\n    <div class='ember-calendar-body'>\n      {{view Ember.Calendar.HeadingTimesView timesBinding='controller.times'}}\n      <div class='ember-calendar-days'>\n      {{controller.day.length}}\n        {{view Ember.Calendar.DayView eventsBinding='controller.day'}}\n      </div>\n    </div>\n  </div>\n");
Ember.TEMPLATES["ember-calendar-week"] = Ember.Handlebars.compile("\n\n\n  <div class='ember-calendar-head'>\n    <div class='ember-calendar-head-previous'><button {{action loadPrevious target='controller'}}>&laquo;</button></div>\n    {{view Ember.Calendar.WeekHeadingDatesView datesBinding='controller.weekDates'}}\n    <div class='ember-calendar-head-next'><button {{action loadNext target='controller'}}>&raquo;</button></div>\n  </div>\n  <div class='ember-calendar-container'>\n    <div class='ember-calendar-body'>\n      {{view Ember.Calendar.HeadingTimesView timesBinding='controller.times'}}\n      {{view Ember.Calendar.WeekDaysView daysBinding='controller.weekDays'}}\n    </div>\n  </div>\n");
Ember.TEMPLATES["ember-calendar-head-date"] = Ember.Handlebars.compile("\n\n\n  {{view.dateString}}\n");
Ember.TEMPLATES["ember-calendar-head-time"] = Ember.Handlebars.compile("\n\n\n  {{view.timeString}}\n");
Ember.TEMPLATES["ember-calendar-event"] = Ember.Handlebars.compile("\n\n\n  <div class='ember-calendar-event-name'>{{view.nameString}}</div>\n  <div class='ember-calendar-event-time'>{{view.timeString}}</div>\n  <div class='ember-calendar-event-location'>{{view.locationString}}</div>\n");
Ember.TEMPLATES["ember-calendar-button-day"] = Ember.Handlebars.compile("\n\n\n  Day\n");
Ember.TEMPLATES["ember-calendar-button-week"] = Ember.Handlebars.compile("\n\n\n  Week\n");
///////////////////////////////////////////////////////////////////////////////
// Namespace
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar = Ember.Namespace.create();


///////////////////////////////////////////////////////////////////////////////
// Controller
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar.CalendarController = Ember.ArrayController.extend({
    startOfWeek: 0
  , startOfDay: 8
  , headingDateFormat: 'ddd MMM D'
  , headingTimeFormat: 'h a'
  , headingTimeRangeStart: 0
  , headingTimeRangeEnd: 24
  , eventTimeFormat: 'h:mm a'
  , eventTimeSeparator: ' - '
  , states: ['week']
  , initialState: 'week'
  , presentState: 'week'
    
  , buttonViewClass: 'Ember.Calendar.ButtonView'
  , headingTimeViewClass: 'Ember.Calendar.HeadingTimeView'
  , eventViewClass: 'Ember.Calendar.EventView'
    
  , weekDayViewClass: 'Ember.Calendar.WeekDayView'
  , weekHeadingDateViewClass: 'Ember.Calendar.WeekHeadingDateView'
    
  , multipleStates: function () {
      return this.get('states').length > 1;
    }.property('states')
  , hasDayState: function () {
      return this.get('states').indexOf('day') !== -1;
    }.property('states')
  , hasWeekState: function () {
      return this.get('states').indexOf('week') !== -1;
    }.property('states')
  , stateIsDay: function () {
      return this.get('presentState') === 'day';
    }.property('presentState')
  , stateIsWeek: function () {
      return this.get('presentState') === 'week';
    }.property('presentState')
    
  , times: function () {
      var times = [];
      var i;
      
      for (i = this.get('headingTimeRangeStart'); i < this.get('headingTimeRangeEnd'); i++) {
        times.push(1000 * 60 * 60 * i);
      }
      
      return times;
    }.property('headingTimeRangeStart', 'headingTimeRangeStart')
    
  , date: null
  , day: function () {
      if (!this.get('date')) { return []; }
      
      var day = [];
      var dayStart = this.get('date').clone();
      var dayEnd = this.get('date').clone().endOf('day');
      
      this.get('content').filter(function (event) {
        return event.end > dayStart && event.start <= dayEnd;
      }).forEach(function (event) {
        var object = {};
        
        Object.keys(event).forEach(function (key) {
          if (key !== 'start' && key !== 'end') {
            object[key] = event[key];
          }
        });
        
        object.start = moment(event.start);
        object.end = moment(dayEnd).endOf('day');
        if (object.end > event.end) { object.end = moment(event.end); }
        
        day.push(object);
      });
      
      return day;
    }.property('content', 'date')
    
  , week: null
  , weekDates: function () {
      if (!this.get('week')) { return []; }
      
      var curr = this.get('week').clone().subtract('days', 1);
      var dates = [];
      var i;
      
      for (i = 0; i < 7; i++) {
        dates.push(curr.add('days', 1).clone());
      }
      
      return dates;
    }.property('week')
  , weekDays: function () {
      if (!this.get('week')) { return []; }
      
      var days = [[], [], [], [], [], [], []];
      var dates = this.get('weekDates');
      var self = this;
      var weekStart = dates[0].clone();
      var weekEnd = dates[6].clone().endOf('day');
      
      this.get('content').forEach(function (event) {
        var start = moment(event.start).clone();
        var end = moment(event.end).clone();
        var object;
        var keys;
        var i;
        var day;
        
        if (end <= weekStart || start > weekEnd) { return; }
        
        while (end > start) {
          object = {};
          keys = Object.keys(event);
          
          for (i = 0; i < keys.length; i++) {
            if (keys[i] !== 'start' && keys[i] !== 'end') {
              object[keys[i]] = event[keys[i]];
            }
          }
          
          object.start = start.clone();
          object.end = start.clone().endOf('day');
          if (object.end > end) { object.end = end.clone(); }
          
          day = object.start.clone().startOf('day').diff(self.get('week'), 'days');
          if (day >= 0 && day <= 6) { days[day].push(object); }
          
          start.add('days', 1).startOf('day');
        }
      });
      
      return days;
    }.property('content', 'weekDates')
    
  , actions: {
        loadPrevious: function () {
          if (this.get('presentState') === 'day') {
            this.set('date', moment(this.get('date').clone().subtract('days', 1)));
          } else if (this.get('presentState') === 'week') {
            this.set('week', moment(this.get('week').clone().subtract('days', 7)));
          }
        }
      , loadNext: function () {
          if (this.get('presentState') === 'day') {
            this.set('date', moment(this.get('date').clone().add('days', 1)));
          } else if (this.get('presentState') === 'week') {
            this.set('week', moment(this.get('week').clone().add('days', 7)));
          }
        }
      , changeState: function (state) {
          if (state === this.get('presentState')) {
            return;
          } else if (state === 'day') {
            this.set('date', moment(this.get('week')));
            this.notifyPropertyChange('date');
            this.set('presentState', 'day');
          } else if (state === 'week') {
            this.set('week', moment(this.get('date')).subtract('days', (moment(this.get('date')).day() + 7 - this.get('startOfWeek')) % 7).startOf('day'));
            this.notifyPropertyChange('week');
            this.set('presentState', 'week');
          }
        }
    }
    
  , init: function () {
      this._super();
      
      if (this.states.indexOf('day') !== -1) {
        this.set('date', moment(this.get('initialDate')).startOf('day'));
      }
      
      if (this.states.indexOf('week') !== -1) {
        this.set('week', moment(this.get('initialDate')).subtract('days', (moment(this.get('initialDate')).day() + 7 - this.get('startOfWeek')) % 7).startOf('day'));
      }
      
      this.set('presentState', this.get('initialState'));
    }
});


///////////////////////////////////////////////////////////////////////////////
// Generic Views
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar.CalendarView = Ember.View.extend({
    templateName: 'ember-calendar'
});

Ember.Calendar.ButtonsView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-buttons']
  , init: function () {
      this._super();
      
      if (!this.get('controller.multipleStates')) { return; }
      
      if (this.get('controller.hasDayState')) {
        this.pushObject(this.createChildView(Ember.get(this.get('parentView.controller.buttonViewClass')), { buttonState: 'day', controller: this.get('controller') }));
      }
      
      if (this.get('controller.hasWeekState')) {
        this.pushObject(this.createChildView(Ember.get(this.get('parentView.controller.buttonViewClass')), { buttonState: 'week', controller: this.get('controller') }));
      }
    }
});

Ember.Calendar.ButtonView = Ember.View.extend({
    tagName: 'button'
  , classNames: ['ember-calendar-button']
  , classNameBindings: ['active:ember-calendar-button-active']
  , templateName: function () {
      return 'ember-calendar-button-' + this.get('buttonState');
    }.property('buttonState')
  , templateNameDidChange: function () {
      this.rerender();
    }.observes('templateName')
  , active: function () {
      return this.get('controller.presentState') === this.get('buttonState');
    }.property('buttonState', 'controller.presentState')
  , click: function () {
      if (this.get('active')) return;
      this.get('controller').send('changeState', this.get('buttonState'));
    }
});

Ember.Calendar.ContainerView = Ember.View.extend({
    classNames: ['ember-calendar']
  , templateName: function () {
      return 'ember-calendar-' + this.get('controller.presentState');
    }.property('controller.presentState')
  , templateNameDidChange: function () {
      this.rerender();
    }.observes('templateName')
  , didInsertElement: function () {
      if (['day', 'week'].indexOf(this.get('controller.presentState')) !== -1) {
        var container = $('#' + this.get('elementId') + ' > .ember-calendar-container');
        var body = $('#' + this.get('elementId') + ' > .ember-calendar-container > .ember-calendar-body');
        var start = (this.get('controller.startOfDay') - this.get('controller.headingTimeRangeStart')) / (this.get('controller.headingTimeRangeEnd') - this.get('controller.headingTimeRangeStart'));
        
        container.scrollTop(start * body.height());
      }
    }
});

Ember.Calendar.HeadingDateView = Ember.View.extend({
    templateName: 'ember-calendar-head-date'
  , classNames: ['ember-calendar-head-date']
  , dateString: function () {
      return this.get('date').format(this.get('controller.headingDateFormat'));
    }.property('date')
});

Ember.Calendar.HeadingTimesView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-head-times']
  , updateChildViews: function () {
      var self = this;
      self.removeAllChildren();
      self.pushObjects(self.get('times').map(function (time) {
        return self.createChildView(Ember.get(self.get('controller.headingTimeViewClass')), { time: time });
      }));
    }.observes('times')
  , init: function () {
      this._super();
      this.updateChildViews();
    }
});

Ember.Calendar.HeadingTimeView = Ember.View.extend({
    templateName: 'ember-calendar-head-time'
  , classNames: ['ember-calendar-head-time']
  , timeString: function () {
      return moment().startOf('day').add('milliseconds', this.get('time')).format(this.get('parentView.parentView.controller.headingTimeFormat'));
    }.property('time')
});

Ember.Calendar.DayView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-day']
  , updateChildViews: function () {
      var self = this;
      self.removeAllChildren();
      self.pushObjects(self.get('events').map(function (event) {
        return self.createChildView(Ember.get(self.get('parentView.controller.eventViewClass')), { event: event, parentView: self.get('parentView') });
      }));
    }.observes('events')
  , init: function () {
      this._super();
      this.updateChildViews();
    }
});

Ember.Calendar.EventView = Ember.View.extend({
    templateName: 'ember-calendar-event'
  , classNames: ['ember-calendar-event']
  , attributeBindings: ['style']
  , style: function () {
      if (!this.get('event')) {
        return '';
      }
      
      var start = moment(this.get('event.start')).valueOf();
      var end = moment(this.get('event.end')).valueOf();
      var rangeStart = moment(start).startOf('day').valueOf() + 1000 * 60 * 60 * this.get('parentView.controller.headingTimeRangeStart');
      var rangeEnd = moment(start).startOf('day').valueOf() + 1000 * 60 * 60 * this.get('parentView.controller.headingTimeRangeEnd');
      
      return 'top: ' + 100 * (start - rangeStart) / (rangeEnd - rangeStart) + '%; height: ' + 100 * (end - start) / (rangeEnd - rangeStart) + '%;';
    }.property('event', 'event.start', 'event.end')
  , nameString: function () {
      if (!this.get('event')) {
        return '';
      }
      return this.get('event.name');
    }.property('event', 'event.name')
  , timeString: function () {
      if (!this.get('event')) {
        return '';
      }
      return this.get('event.start').format(this.get('parentView.controller.eventTimeFormat')) + this.get('parentView.controller.eventTimeSeparator') + this.get('event.end').format(this.get('parentView.controller.eventTimeFormat'));
    }.property('event', 'event.start', 'event.end')
  , locationString: function () {
      if (!this.get('event') || !this.get('event.location')) {
        return '';
      }
      return this.get('event.location.name') || this.get('event.location.address');
    }.property('event', 'event.location')
});


///////////////////////////////////////////////////////////////////////////////
// Week Views
///////////////////////////////////////////////////////////////////////////////
Ember.Calendar.WeekHeadingDatesView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-head-dates']
  , updateChildViews: function () {
      var self = this;
      self.removeAllChildren();
      self.pushObjects(self.get('dates').map(function (date) {
        return self.createChildView(Ember.get(self.get('parentView.controller.weekHeadingDateViewClass')), { date: date });
      }));
    }.observes('dates')
  , init: function () {
      this._super();
      this.updateChildViews();
    }
});

Ember.Calendar.WeekHeadingDateView = Ember.Calendar.HeadingDateView.extend({
    templateName: 'ember-calendar-head-date'
  , classNames: ['ember-calendar-head-week-date']
  , dateString: function () {
      return this.get('date').format(this.get('parentView.parentView.controller.headingDateFormat'));
    }.property('date')
});

Ember.Calendar.WeekDaysView = Ember.ContainerView.extend({
    classNames: ['ember-calendar-days']
  , updateChildViews: function () {
      var self = this;
      self.removeAllChildren();
      self.pushObjects(self.get('days').map(function (events) {
        return self.createChildView(Ember.get(self.get('parentView.controller.weekDayViewClass')), { events: events, parentView: self.get('parentView') });
      }));
    }.observes('days')
  , init: function () {
      this._super();
      this.updateChildViews();
    }
});

Ember.Calendar.WeekDayView = Ember.Calendar.DayView.extend({
    classNames: ['ember-calendar-week-day']
  , updateChildViews: function () {
      var self = this;
      self.removeAllChildren();
      self.pushObjects(self.get('events').map(function (event) {
        return self.createChildView(Ember.get(self.get('parentView.controller.eventViewClass')), { event: event, parentView: self.get('parentView') });
      }));
    }.observes('events')
});